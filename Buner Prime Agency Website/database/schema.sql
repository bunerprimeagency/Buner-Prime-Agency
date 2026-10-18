-- BPA database. Run this whole file once in the Supabase SQL editor.

create table services (id bigint generated always as identity primary key, n text not null, d text, sort bigint default 0);
create table team (id bigint generated always as identity primary key, n text not null, r text, p text default '', sort bigint default 0);
create table courses (id bigint generated always as identity primary key, n text not null, d text, x text, sort bigint default 0);
create table portfolio (id bigint generated always as identity primary key, t text not null, s text, i text, sort bigint default 0);
create table inquiries (id bigint generated always as identity primary key, name text, phone text, message text, created_at timestamptz default now());


insert into services (n,d,sort) values
('Digital Marketing','Strategy and campaigns that bring real customers.',1),
('Social Media Marketing','Content and community across every platform.',2),
('Meta Ads & Google Ads','Paid ads tuned for leads and sales.',3),
('Web Development','Fast, modern websites and web apps.',4),
('UI/UX Design','Interfaces people enjoy and understand.',5),
('Graphic Design','Logos, branding and social creatives.',6),
('Video Editing','Reels, ads and promos that hold attention.',7),
('AI & Automation','Chatbots and workflows that save hours.',8),
('Photography & Videography','Product and brand shoots, start to finish.',9),
('Digital Tools & Subscriptions','Premium tools and subscriptions, set up for you.',10);


insert into team (n,r,sort) values
('Mr Kamran Khan','CEO & Founder',1),
('Kamran Ahmad','Operation Manager',2),
('Saad Hadi','AI Automation',3),
('Muhsin Khan','Video Editor',4),
('Ahmad Jan','Web Developer',5),
('Abdul Basit','Digital Marketer',6),
('Jawad Khan','Videography',7),
('Adnan Khan','SEO Specialist',8),
('Sawaira Akbar','Meta & Google Ads',9),
('Shamla Khan','Graphic Designer',10);
insert into courses (n,d,x,sort) values
('Digital Marketing Basics','Learn how to market a business online.','Duration, fee and schedule: to be announced',1),
('Social Media Management','Plan, post and grow brand accounts.','Duration, fee and schedule: to be announced',2),
('Graphic Design Starter','Design tools and layout essentials.','Duration, fee and schedule: to be announced',3);

-- Settings (contact details) and admin roles
create table settings (id int primary key default 1 check (id = 1), call_no text, whatsapp text, email text, location text);
insert into settings (id, call_no, whatsapp, email, location) values (1, '03490178074', '03348364835', 'bunerprimeagency@gmail.com', 'Pir Baba, Buner');
create table admins (user_id uuid primary key references auth.users(id) on delete cascade, role text not null check (role in ('owner','developer')));
create function public.my_role() returns text language sql stable security definer set search_path = public as $$ select role from public.admins where user_id = auth.uid() $$;

-- Row level security
alter table services enable row level security;
alter table team enable row level security;
alter table courses enable row level security;
alter table portfolio enable row level security;
alter table inquiries enable row level security;
alter table settings enable row level security;
alter table admins enable row level security;

-- Everyone can read the site content. Both admins (owner and developer) can add, edit and delete.
create policy "services read" on services for select using (true);
create policy "team read" on team for select using (true);
create policy "courses read" on courses for select using (true);
create policy "portfolio read" on portfolio for select using (true);
create policy "settings read" on settings for select using (true);
create policy "services admin insert" on services for insert to authenticated with check (public.my_role() in ('owner','developer'));
create policy "services admin update" on services for update to authenticated using (public.my_role() in ('owner','developer')) with check (public.my_role() in ('owner','developer'));
create policy "services admin delete" on services for delete to authenticated using (public.my_role() in ('owner','developer'));
create policy "team admin insert" on team for insert to authenticated with check (public.my_role() in ('owner','developer'));
create policy "team admin update" on team for update to authenticated using (public.my_role() in ('owner','developer')) with check (public.my_role() in ('owner','developer'));
create policy "team admin delete" on team for delete to authenticated using (public.my_role() in ('owner','developer'));
create policy "courses admin insert" on courses for insert to authenticated with check (public.my_role() in ('owner','developer'));
create policy "courses admin update" on courses for update to authenticated using (public.my_role() in ('owner','developer')) with check (public.my_role() in ('owner','developer'));
create policy "courses admin delete" on courses for delete to authenticated using (public.my_role() in ('owner','developer'));
create policy "portfolio admin insert" on portfolio for insert to authenticated with check (public.my_role() in ('owner','developer'));
create policy "portfolio admin update" on portfolio for update to authenticated using (public.my_role() in ('owner','developer')) with check (public.my_role() in ('owner','developer'));
create policy "portfolio admin delete" on portfolio for delete to authenticated using (public.my_role() in ('owner','developer'));
create policy "settings admin insert" on settings for insert to authenticated with check (public.my_role() in ('owner','developer'));
create policy "settings admin update" on settings for update to authenticated using (public.my_role() in ('owner','developer')) with check (public.my_role() in ('owner','developer'));

-- Visitors can send an inquiry. Only the two admins can read them.
create policy "inquiry insert" on inquiries for insert to anon, authenticated with check (true);
create policy "inquiry admin read" on inquiries for select to authenticated using (public.my_role() in ('owner','developer'));

-- Each admin can read only their own role.
create policy "own role" on admins for select to authenticated using (user_id = auth.uid());

-- Photo storage (public read, both admins upload)
insert into storage.buckets (id, name, public) values ('site-images', 'site-images', true) on conflict (id) do nothing;
-- Images in this public bucket open by their link (that is how the website shows them). Nobody can list or browse the files.
create policy "site images upload" on storage.objects for insert to authenticated with check (bucket_id = 'site-images' and public.my_role() in ('owner','developer'));
create policy "site images update" on storage.objects for update to authenticated using (bucket_id = 'site-images' and public.my_role() in ('owner','developer'));
create policy "site images delete" on storage.objects for delete to authenticated using (bucket_id = 'site-images' and public.my_role() in ('owner','developer'));

-- LAST STEP: create the users in Authentication > Users first. The CEO line is set for Mr Kamran Khan.
insert into admins (user_id, role) select id, 'owner' from auth.users where email = 'bunerprimeagency@gmail.com';
insert into admins (user_id, role) select id, 'developer' from auth.users where email = 'azmatali1122az2@gmail.com';
