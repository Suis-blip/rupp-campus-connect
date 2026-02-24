
-- Role enum
CREATE TYPE public.app_role AS ENUM ('teacher', 'student', 'admin');

-- Profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL DEFAULT '',
  email TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- User roles table (separate from profiles per security requirements)
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL,
  UNIQUE(user_id, role)
);
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Classes table
CREATE TABLE public.classes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  teacher_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  code TEXT NOT NULL,
  description TEXT DEFAULT '',
  schedule TEXT DEFAULT '',
  room TEXT DEFAULT '',
  capacity INT DEFAULT 40,
  semester TEXT DEFAULT '',
  year INT DEFAULT EXTRACT(YEAR FROM now())::INT,
  invite_code TEXT NOT NULL DEFAULT substr(md5(random()::text), 1, 8),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.classes ENABLE ROW LEVEL SECURITY;

-- Enrollments table
CREATE TABLE public.enrollments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  class_id UUID NOT NULL REFERENCES public.classes(id) ON DELETE CASCADE,
  enrolled_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(student_id, class_id)
);
ALTER TABLE public.enrollments ENABLE ROW LEVEL SECURITY;

-- Security definer: check role
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- Security definer: is teacher of class
CREATE OR REPLACE FUNCTION public.is_teacher_of_class(_user_id UUID, _class_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.classes
    WHERE id = _class_id AND teacher_id = _user_id
  )
$$;

-- Security definer: is student in class
CREATE OR REPLACE FUNCTION public.is_enrolled(_user_id UUID, _class_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.enrollments
    WHERE student_id = _user_id AND class_id = _class_id
  )
$$;

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, name, email)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'name', ''), NEW.email);
  
  -- Default role is student
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, COALESCE((NEW.raw_user_meta_data->>'role')::app_role, 'student'));
  
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- RLS: profiles
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Admins can view all profiles" ON public.profiles FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

-- RLS: user_roles
CREATE POLICY "Users can view own roles" ON public.user_roles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins can manage roles" ON public.user_roles FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- RLS: classes
CREATE POLICY "Teachers can create classes" ON public.classes FOR INSERT WITH CHECK (auth.uid() = teacher_id AND public.has_role(auth.uid(), 'teacher'));
CREATE POLICY "Teachers can view own classes" ON public.classes FOR SELECT USING (teacher_id = auth.uid());
CREATE POLICY "Students can view enrolled classes" ON public.classes FOR SELECT USING (public.is_enrolled(auth.uid(), id));
CREATE POLICY "Admins can view all classes" ON public.classes FOR SELECT USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Teachers can update own classes" ON public.classes FOR UPDATE USING (teacher_id = auth.uid());
CREATE POLICY "Teachers can delete own classes" ON public.classes FOR DELETE USING (teacher_id = auth.uid());

-- RLS: enrollments
CREATE POLICY "Students can view own enrollments" ON public.enrollments FOR SELECT USING (student_id = auth.uid());
CREATE POLICY "Teachers can view class enrollments" ON public.enrollments FOR SELECT USING (public.is_teacher_of_class(auth.uid(), class_id));
CREATE POLICY "Students can enroll themselves" ON public.enrollments FOR INSERT WITH CHECK (auth.uid() = student_id AND public.has_role(auth.uid(), 'student'));
CREATE POLICY "Students can unenroll" ON public.enrollments FOR DELETE USING (student_id = auth.uid());
CREATE POLICY "Teachers can remove students" ON public.enrollments FOR DELETE USING (public.is_teacher_of_class(auth.uid(), class_id));
CREATE POLICY "Admins can manage enrollments" ON public.enrollments FOR ALL USING (public.has_role(auth.uid(), 'admin'));
