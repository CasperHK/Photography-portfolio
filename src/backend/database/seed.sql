INSERT INTO albums (title, slug, description)
VALUES ('Portfolio', 'portfolio', 'Main photography portfolio')
ON CONFLICT(slug) DO NOTHING;

INSERT INTO photos (album_id, title, description, file_path, thumb_path, width, height, sort_order)
VALUES
  (1, 'Golden Hour',   'Warm sunset light',        '/media/photos/photo-1.jpg', '/media/thumbs/photo-1.jpg', 3840, 2160, 1),
  (1, 'City Night',    'Neon and reflections',      '/media/photos/photo-2.jpg', '/media/thumbs/photo-2.jpg', 3840, 2160, 2),
  (1, 'Mountain Air',  'Wide alpine landscape',     '/media/photos/photo-3.jpg', '/media/thumbs/photo-3.jpg', 3840, 2160, 3),
  (1, 'Ocean Mist',    'Coastal morning fog',       '/media/photos/photo-4.jpg', '/media/thumbs/photo-4.jpg', 3840, 2160, 4),
  (1, 'Forest Path',   'Dappled light in the trees','/media/photos/photo-5.jpg', '/media/thumbs/photo-5.jpg', 3840, 2160, 5);

INSERT INTO photo_exif (photo_id, camera, lens, aperture, shutter_speed, iso, focal_length, location)
VALUES
  (1, 'Sony A7 IV', '24-70mm f/2.8',  'f/2.8', '1/250', 200,  '35mm', 'Kyoto'),
  (2, 'Sony A7 IV', '50mm f/1.4',     'f/1.8', '1/125', 640,  '50mm', 'Hong Kong'),
  (3, 'Sony A7 IV', '16-35mm f/2.8',  'f/5.6', '1/320', 100,  '20mm', 'Swiss Alps'),
  (4, 'Sony A7 IV', '24-70mm f/2.8',  'f/4.0', '1/500', 400,  '28mm', 'Big Sur'),
  (5, 'Sony A7 IV', '85mm f/1.8',     'f/2.0', '1/200', 320,  '85mm', 'Pacific Northwest')
ON CONFLICT(photo_id) DO NOTHING;
