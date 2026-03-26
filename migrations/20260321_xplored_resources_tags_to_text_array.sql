begin;

alter table xplored_resources
add column if not exists tags_new text[];

update xplored_resources
set tags_new = case
  when tags is null or btrim(tags) = '' then '{}'::text[]
  else regexp_split_to_array(
    regexp_replace(tags, '\s*,\s*', ',', 'g'),
    ','
  )
end;

alter table xplored_resources
rename column tags to tags_legacy;

alter table xplored_resources
rename column tags_new to tags;

commit;
