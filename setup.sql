-- Run this once in Supabase: SQL Editor > New query > paste > Run
create table if not exists site(key text primary key, value jsonb not null);
create table if not exists items(id text primary key, sec text not null, pub boolean not null default true, t bigint not null default 0, data jsonb not null default '{}');
alter table site enable row level security;
alter table items enable row level security;
create policy "site read" on site for select using (true);
create policy "site write" on site for all to authenticated using (true) with check (true);
create policy "items read" on items for select using (pub or auth.role()='authenticated');
create policy "items write" on items for all to authenticated using (true) with check (true);
insert into storage.buckets (id,name,public) values ('media','media',true) on conflict (id) do nothing;
create policy "media read" on storage.objects for select using (bucket_id='media');
create policy "media insert" on storage.objects for insert to authenticated with check (bucket_id='media');
create policy "media update" on storage.objects for update to authenticated using (bucket_id='media');
create policy "media delete" on storage.objects for delete to authenticated using (bucket_id='media');
