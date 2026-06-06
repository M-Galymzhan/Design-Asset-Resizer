-- Create custom types
CREATE TYPE invoice_status AS ENUM ('pending', 'paid', 'cancelled');

-- Create profiles table
CREATE TABLE public.profiles (
    id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL PRIMARY KEY,
    full_name TEXT,
    kaspi_phone TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles RLS policies
CREATE POLICY "Users can view own profile" 
    ON profiles FOR SELECT 
    USING (auth.uid() = id);

CREATE POLICY "Public can view profiles"
    ON profiles FOR SELECT
    USING (true);

CREATE POLICY "Users can update own profile" 
    ON profiles FOR UPDATE 
    USING (auth.uid() = id);

-- Create invoices table
CREATE TABLE public.invoices (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    seller_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    amount NUMERIC(10, 2) NOT NULL CHECK (amount > 0),
    description TEXT NOT NULL,
    status invoice_status DEFAULT 'pending'::invoice_status NOT NULL,
    payer_name TEXT,
    payer_phone TEXT,
    paid_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;

-- Invoices RLS policies
-- Sellers can CRUD their own invoices
CREATE POLICY "Sellers can view own invoices" 
    ON invoices FOR SELECT 
    USING (auth.uid() = seller_id);

CREATE POLICY "Sellers can insert own invoices" 
    ON invoices FOR INSERT 
    WITH CHECK (auth.uid() = seller_id);

CREATE POLICY "Sellers can update own invoices" 
    ON invoices FOR UPDATE 
    USING (auth.uid() = seller_id);

CREATE POLICY "Sellers can delete own invoices" 
    ON invoices FOR DELETE 
    USING (auth.uid() = seller_id);

-- Public can view invoices they have the ID for (for the payment page)
-- We use a simpler policy since they need the exact UUID to access it
CREATE POLICY "Public can view invoice by id"
    ON invoices FOR SELECT
    USING (true);

-- Public can update invoice status to paid
-- Note: This is an open update policy just for the payment flow in the MVP.
-- We might want to restrict this in the API route later using a service role key.
CREATE POLICY "Public can mark invoice as paid"
    ON invoices FOR UPDATE
    USING (status = 'pending'::invoice_status)
    WITH CHECK (
        status = 'paid'::invoice_status AND
        amount = (SELECT amount FROM invoices WHERE id = invoices.id) AND
        description = (SELECT description FROM invoices WHERE id = invoices.id) AND
        seller_id = (SELECT seller_id FROM invoices WHERE id = invoices.id)
    );


-- Create trigger to automatically create a profile when a new user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, full_name)
    VALUES (new.id, new.raw_user_meta_data->>'full_name');
    RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
