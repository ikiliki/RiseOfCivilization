ALTER TABLE player_state
  ALTER COLUMN assets_json SET DEFAULT '{"hatAssetId":"cap","shoesAssetId":"sneakers"}'::jsonb;

UPDATE player_state
SET assets_json = jsonb_build_object(
  'hatAssetId',
  'cap',
  'shoesAssetId',
  'sneakers'
)
WHERE assets_json IS NULL
   OR (
     COALESCE(assets_json->>'hatAssetId', '') IN ('', 'none')
     AND COALESCE(assets_json->>'shoesAssetId', '') IN ('', 'none')
   );

