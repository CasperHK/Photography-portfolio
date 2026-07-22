# Storage directory for media files

Place your image files here before running the server:

```
storage/
├── photos/
│   ├── photo-1.jpg
│   ├── photo-2.jpg
│   ├── photo-3.jpg
│   ├── photo-4.jpg
│   └── photo-5.jpg
└── thumbs/
    ├── photo-1.jpg
    ├── photo-2.jpg
    ├── photo-3.jpg
    ├── photo-4.jpg
    └── photo-5.jpg
```

The backend serves this directory at `/media/*`.

Example: `storage/photos/photo-1.jpg` is accessible at:
`http://localhost:8080/media/photos/photo-1.jpg`
