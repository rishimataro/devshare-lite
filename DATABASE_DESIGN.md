# Thiết kế Cơ sở Dữ liệu - DevShare Lite

## Tổng quan

DevShare Lite sử dụng **MongoDB** - một hệ quản trị cơ sở dữ liệu NoSQL document-oriented. Dự án được thiết kế với 3 collections chính: **Users**, **Posts**, và **Comments**.

## Lý do lựa chọn MongoDB

### Ưu điểm của MongoDB cho dự án này:

1. **Linh hoạt về cấu trúc dữ liệu:**
   - Dễ dàng mở rộng schema khi cần thêm trường mới
   - Phù hợp với dữ liệu có cấu trúc phức tạp như profile user, comments đa cấp

2. **Hiệu suất cao:**
   - Truy vấn nhanh với index phù hợp
   - Aggregate pipeline mạnh mẽ cho các truy vấn phức tạp

3. **Khả năng mở rộng:**
   - Horizontal scaling tốt
   - Replication và sharding native

4. **Tương thích với JavaScript/TypeScript:**
   - JSON native giúp dễ dàng tích hợp với Node.js
   - Mongoose ODM cung cấp type safety và validation

5. **Phù hợp với social features:**
   - Embedded documents cho replies comments
   - Array fields cho likes, follows, tags

## Sơ đồ quan hệ Collections

```
┌─────────────────┐         ┌─────────────────┐         ┌─────────────────┐
│      Users      │         │      Posts      │         │    Comments     │
├─────────────────┤         ├─────────────────┤         ├─────────────────┤
│ _id (ObjectId)  │◄────────┤ authorId        │         │ _id (ObjectId)  │
│ username        │         │ _id (ObjectId)  │◄────────┤ postId          │
│ email           │         │ title           │         │ authorId        │────┐
│ password        │         │ content         │         │ content         │    │
│ role            │         │ status          │         │ parentId[]      │    │
│ profile         │         │ tags[]          │         │ replies[]       │    │
│ isActive        │         │ images[]        │         │ upvotes[]       │────┤
│ codeId          │         │ publishedAt     │         │ downvotes[]     │    │
│ codeExpired     │         │ viewCount       │         │ createdAt       │    │
│ following[]     │────┐    │ likes[]         │         │ updatedAt       │    │
│ followers[]     │◄───┘    │ createdAt       │         └─────────────────┘    │
│ createdAt       │         │ updatedAt       │                                │
│ updatedAt       │         └─────────────────┘                                │
└─────────────────┘                                                            │
        ▲                                                                      │
        └──────────────────────────────────────────────────────────────────────┘
```

## Chi tiết Collections

### 1. Collection: `users`

**Mô tả:** Lưu trữ thông tin người dùng và tài khoản

#### Cấu trúc Document:
```typescript
{
  _id: ObjectId,              // Primary Key - MongoDB auto-generated
  username: String,           // Tên đăng nhập (unique)
  email: String,              // Email (unique)
  password: String,           // Mật khẩu đã hash (bcrypt)
  role: String,               // Vai trò: 'user' | 'admin'
  profile: {                  // Thông tin hồ sơ (embedded document)
    bio: String,              // Tiểu sử
    avatar: String            // URL avatar (Cloudinary)
  },
  isActive: Boolean,          // Trạng thái kích hoạt tài khoản
  codeId: String,             // Mã xác thực email (UUID)
  codeExpired: Date,          // Thời gian hết hạn mã xác thực
  following: [ObjectId],      // Danh sách người dùng đang follow
  followers: [ObjectId],      // Danh sách người follow mình
  createdAt: Date,            // Thời gian tạo (auto-generated)
  updatedAt: Date             // Thời gian cập nhật (auto-generated)
}
```

#### Ràng buộc và Validation:
- **username:** Required, unique, index
- **email:** Required, unique, index, email format validation
- **password:** Required, min 6 characters, bcrypt hashed
- **role:** Enum ['user', 'admin'], default 'user'
- **isActive:** Boolean, default false, index
- **following/followers:** Array of valid ObjectIds referencing Users

#### Indexes:
```javascript
// Compound index cho authentication
{ email: 1, isActive: 1 }

// Index cho email verification
{ codeId: 1, codeExpired: 1 }

// Single field indexes
{ username: 1 }
{ email: 1 }
{ isActive: 1 }
```

#### Methods:
- `isCodeExpired()`: Kiểm tra mã xác thực có hết hạn không
- `isCodeValid(code)`: Kiểm tra mã xác thực có hợp lệ không

---

### 2. Collection: `posts`

**Mô tả:** Lưu trữ bài viết và nội dung

#### Cấu trúc Document:
```typescript
{
  _id: ObjectId,              // Primary Key
  title: String,              // Tiêu đề bài viết
  content: String,            // Nội dung Markdown
  authorId: ObjectId,         // Reference đến User
  status: String,             // Trạng thái: 'draft' | 'published' | 'archived'
  tags: [String],             // Mảng tags/keywords
  images: [String],           // Mảng URLs hình ảnh (Cloudinary)
  publishedAt: Date,          // Thời gian xuất bản
  viewCount: Number,          // Số lượt xem
  likes: [ObjectId],          // Mảng User IDs đã like
  createdAt: Date,            // Thời gian tạo
  updatedAt: Date             // Thời gian cập nhật
}
```

#### Ràng buộc và Validation:
- **title:** Required, string, max 200 characters
- **content:** Required, string
- **authorId:** Required, valid ObjectId, reference User
- **status:** Enum ['draft', 'published', 'archived'], default 'draft'
- **tags:** Array of strings, max 10 tags
- **images:** Array of valid URLs
- **viewCount:** Number, default 0, min 0
- **likes:** Array of valid ObjectIds referencing Users

#### Indexes:
```javascript
// Compound index cho published posts
{ status: 1, publishedAt: -1 }

// Index cho author posts
{ authorId: 1, createdAt: -1 }

// Text index cho tìm kiếm
{ title: "text", content: "text", tags: "text" }

// Index cho tags
{ tags: 1 }
```

#### Business Logic:
- Chỉ posts có `status: 'published'` mới hiển thị công khai
- `publishedAt` được set khi status chuyển thành 'published'
- `viewCount` tăng mỗi khi có người xem (chỉ với published posts)
- Like/Unlike: toggle user ID trong mảng `likes`

---

### 3. Collection: `comments`

**Mô tả:** Lưu trữ bình luận và replies (đa cấp)

#### Cấu trúc Document:
```typescript
{
  _id: ObjectId,              // Primary Key
  postId: ObjectId,           // Reference đến Post
  authorId: ObjectId,         // Reference đến User
  content: String,            // Nội dung bình luận
  parentId: [ObjectId],       // Array chứa parent comment ID (nếu là reply)
  replies: [ObjectId],        // Array chứa child comment IDs
  upvotes: [ObjectId],        // Mảng User IDs đã upvote
  downvotes: [ObjectId],      // Mảng User IDs đã downvote
  createdAt: Date,            // Thời gian tạo
  updatedAt: Date             // Thời gian cập nhật
}
```

#### Ràng buộc và Validation:
- **postId:** Required, valid ObjectId, reference Post
- **authorId:** Required, valid ObjectId, reference User
- **content:** Required, string, max 1000 characters
- **parentId:** Optional, array of valid ObjectIds, max 1 element
- **replies:** Array of valid ObjectIds referencing Comments
- **upvotes/downvotes:** Arrays of valid ObjectIds referencing Users

#### Indexes:
```javascript
// Compound index cho comments của một post
{ postId: 1, createdAt: -1 }

// Index cho parent comments (root comments)
{ postId: 1, parentId: 1 }

// Index cho author comments
{ authorId: 1, createdAt: -1 }
```

#### Business Logic:
- **Hierarchical Structure:** Sử dụng `parentId` và `replies` để tạo cấu trúc đa cấp
- **Root Comments:** `parentId` là array rỗng hoặc undefined
- **Reply Comments:** `parentId` chứa ID của comment cha
- **Vote System:** User không thể vote cùng lúc upvote và downvote
- **Cascade Delete:** Khi xóa comment cha, tất cả replies cũng bị xóa

## Mối quan hệ giữa Collections

### 1. User - Post Relationship (One-to-Many)
```javascript
// User có thể có nhiều Posts
User (1) ──── Posts (N)
   ↑              │
   └─ authorId ────┘
```

### 2. Post - Comment Relationship (One-to-Many)
```javascript
// Post có thể có nhiều Comments
Post (1) ──── Comments (N)
   ↑                │
   └─ postId ────────┘
```

### 3. User - Comment Relationship (One-to-Many)
```javascript
// User có thể có nhiều Comments
User (1) ──── Comments (N)
   ↑                │
   └─ authorId ──────┘
```

### 4. Comment - Comment Relationship (Self-Referencing, Many-to-Many)
```javascript
// Comment có thể có nhiều replies và có thể là reply của comment khác
Comment ──── Comment (Self-referencing)
   ↑              │
   ├─ parentId ───┘
   └─ replies[] ───┐
                   ↓
              [Child Comments]
```

### 5. User - User Relationship (Many-to-Many)
```javascript
// User có thể follow nhiều users và được follow bởi nhiều users
User ──── User (Self-referencing)
   ↑         │
   ├─ following[] ─┘
   └─ followers[] ─┐
                   ↓
              [Other Users]
```

## Strategies và Best Practices

### 1. Data Modeling Strategies

#### Embedded vs Referenced Documents:
- **User profile:** Embedded (ít thay đổi, luôn load cùng user)
- **Comments replies:** Hybrid (reference IDs + populate khi cần)
- **Post likes:** Embedded array (performance tốt cho social features)

#### Denormalization Examples:
```javascript
// Trong Post document, cache author info để giảm populate
{
  authorId: ObjectId("..."),
  authorInfo: {           // Denormalized data
    username: "john_doe",
    avatar: "https://..."
  }
}
```

### 2. Performance Optimization

#### Indexing Strategy:
- **Compound indexes** cho các truy vấn phổ biến
- **Text indexes** cho full-text search
- **Sparse indexes** cho optional fields

#### Query Optimization:
```javascript
// Sử dụng aggregation pipeline cho complex queries
db.posts.aggregate([
  { $match: { status: 'published' } },
  { $lookup: { from: 'users', localField: 'authorId', foreignField: '_id', as: 'author' } },
  { $sort: { publishedAt: -1 } },
  { $limit: 10 }
]);
```

### 3. Data Consistency

#### Atomic Operations:
- Sử dụng `findOneAndUpdate` với atomic operators
- Transaction support cho multi-document operations

#### Validation:
- **Schema-level validation** với Mongoose
- **Application-level validation** với class-validator
- **Business rule validation** trong service layer

### 4. Scalability Considerations

#### Horizontal Scaling:
- **Sharding key candidates:** `authorId` cho posts, `postId` cho comments
- **Read replicas** cho read-heavy operations

#### Data Archiving:
- **TTL indexes** cho temporary data (verification codes)
- **Separate collections** cho archived posts

## Tối ưu hóa và Monitoring

### 1. Performance Metrics
- Query execution time
- Index usage statistics
- Document size distribution
- Connection pool usage

### 2. Backup Strategy
- **Automated daily backups** với MongoDB Atlas
- **Point-in-time recovery** capability
- **Cross-region replication** cho disaster recovery

### 3. Security Measures
- **Authentication:** MongoDB user với limited permissions
- **Encryption:** At-rest và in-transit
- **Input validation:** Prevent NoSQL injection
- **Rate limiting:** API level protection

## Migration và Versioning

### Schema Evolution Strategy:
1. **Backward compatible changes:** Thêm optional fields
2. **Breaking changes:** Version-controlled migration scripts
3. **Data transformation:** Background jobs cho large datasets

### Example Migration Script:
```javascript
// Add new field to existing documents
db.users.updateMany(
  { profile: { $exists: false } },
  { $set: { profile: { bio: "", avatar: "" } } }
);
```

Thiết kế database này đảm bảo:
- **Hiệu suất cao** với indexing tối ưu
- **Tính nhất quán** dữ liệu với validation
- **Khả năng mở rộng** cho tương lai
- **Bảo mật** với authentication và authorization
- **Backup và recovery** đầy đủ
