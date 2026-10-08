# VYBE API Reference

Base URL: `/api`

---

## 1. Authentication Endpoints

### 1.1 Register User
- **Method**: `POST`
- **Path**: `/api/auth/signup`
- **Body**:
```json
{
  "username": "alex_rivers",
  "displayName": "Alex Rivers",
  "email": "alex@example.com",
  "password": "securepassword123",
  "interests": ["Video Editing", "Photography", "Technology"]
}
```
- **Response** (201 Created):
```json
{
  "success": true,
  "message": "Welcome to VYBE! Account created successfully.",
  "user": { ... },
  "token": "eyJhbGciOi..."
}
```
- **Cookies**: Sets `vybe_token` (HTTP-only, 7 days).

---

### 1.2 Login User
- **Method**: `POST`
- **Path**: `/api/auth/login`
- **Body**:
```json
{
  "loginIdentifier": "alex_rivers",
  "password": "securepassword123"
}
```
- **Response** (200 OK):
```json
{
  "success": true,
  "message": "Logged in successfully.",
  "user": { ... },
  "token": "eyJhbGciOi..."
}
```
- **Cookies**: Sets `vybe_token` (HTTP-only).

---

### 1.3 Current Session
- **Method**: `GET`
- **Path**: `/api/auth/me`
- **Headers**: Optional `Authorization: Bearer <token>` or uses `vybe_token` cookie.
- **Response** (200 OK):
```json
{
  "success": true,
  "user": { ... }
}
```

---

### 1.4 Logout User
- **Method**: `POST`
- **Path**: `/api/auth/logout`
- **Response** (200 OK):
```json
{
  "success": true,
  "message": "Logged out successfully."
}
```

---

## 2. Post & Community Endpoints (Phase 2)

### 2.1 Get Feed Posts
- **Method**: `GET`
- **Path**: `/api/posts?limit=25&offset=0&community=Photography&saved=false`
- **Response** (200 OK):
```json
{
  "success": true,
  "posts": [
    {
      "id": "post_seed_1",
      "authorId": "usr_creator_01",
      "author": { ... },
      "communityName": "🎬 Video Editing",
      "content": "...",
      "mediaUrls": ["..."],
      "mediaType": "CAROUSEL",
      "likesCount": 342,
      "commentsCount": 3,
      "sharesCount": 19,
      "isLiked": false,
      "isSaved": false,
      "createdAt": "2026-10-03T18:00:00Z"
    }
  ],
  "total": 4,
  "hasMore": false
}
```

---

### 2.2 Create Post
- **Method**: `POST`
- **Path**: `/api/posts`
- **Headers**: Requires authentication cookie or Bearer token.
- **Body**:
```json
{
  "content": "Exploring anamorphic lenses on Sony FX3",
  "communityName": "🎬 Video Editing",
  "mediaUrls": ["https://..."],
  "mediaType": "IMAGE",
  "hashtags": ["#SonyFX3", "#Cinematography"],
  "poll": {
    "question": "Which aspect ratio do you prefer?",
    "options": ["2.39:1 Anamorphic", "16:9 Standard", "9:16 Vertical"]
  }
}
```
- **Response** (201 Created):
```json
{
  "success": true,
  "message": "Post created successfully!",
  "post": { ... }
}
```

---

### 2.3 Single Post & Deletion
- **Method**: `GET` | `DELETE`
- **Path**: `/api/posts/[id]`
- **Response**: Fetches single post or removes post (if authenticated author).

---

### 2.4 Toggle Post Like
- **Method**: `POST`
- **Path**: `/api/posts/[id]/like`
- **Response** (200 OK):
```json
{
  "success": true,
  "isLiked": true,
  "likesCount": 343
}
```

---

### 2.5 Toggle Post Save / Bookmark
- **Method**: `POST`
- **Path**: `/api/posts/[id]/save`
- **Response** (200 OK):
```json
{
  "success": true,
  "isSaved": true
}
```

---

### 2.6 Vote in Community Poll
- **Method**: `POST`
- **Path**: `/api/posts/[id]/poll`
- **Body**:
```json
{
  "optionId": "opt_1"
}
```
- **Response** (200 OK):
```json
{
  "success": true,
  "poll": {
    "question": "...",
    "options": [ ... ],
    "totalVotes": 689,
    "userVotedOptionId": "opt_1"
  }
}
```

---

### 2.7 Get Comments & Threaded Replies
- **Method**: `GET`
- **Path**: `/api/posts/[id]/comments`
- **Response** (200 OK):
```json
{
  "success": true,
  "comments": [
    {
      "id": "comm_1",
      "author": { ... },
      "content": "...",
      "likesCount": 14,
      "isLiked": false,
      "replies": [ ... ],
      "createdAt": "..."
    }
  ]
}
```

---

### 2.8 Add Comment or Nested Reply
- **Method**: `POST`
- **Path**: `/api/posts/[id]/comments`
- **Body**:
```json
{
  "content": "Amazing color separation!",
  "parentId": "comm_1" // optional for nested reply
}
```
- **Response** (201 Created):
```json
{
  "success": true,
  "comment": { ... }
}
```

---

### 2.9 Like a Comment
- **Method**: `POST`
- **Path**: `/api/comments/[id]/like`
- **Response** (200 OK):
```json
{
  "success": true,
  "isLiked": true,
  "likesCount": 15
}
```

---

### 2.10 Report Content
- **Method**: `POST`
- **Path**: `/api/posts/[id]/report`
- **Body**:
```json
{
  "reason": "Spam or misleading content: Promotional link flooding"
}
```
- **Response** (200 OK):
```json
{
  "success": true,
  "message": "Post reported. Our safety and moderation team will review this promptly."
}
```

---

## 3. Profile Endpoints (Phase 2)

### 3.1 Update User Profile
- **Method**: `PUT`
- **Path**: `/api/profile/update`
- **Body**:
```json
{
  "displayName": "Alex Rivers 🎬",
  "bio": "Filmmaker & Colorist",
  "location": "Tokyo / Los Angeles",
  "website": "https://vybe.social/alex_rivers",
  "avatarUrl": "...",
  "coverImageUrl": "...",
  "interests": ["Video Editing", "Photography", "Movies"]
}
```
- **Response** (200 OK):
```json
{
  "success": true,
  "message": "Profile updated successfully!",
  "user": { ... }
}
```

---

### 3.2 Get Public Creator Profile
- **Method**: `GET`
- **Path**: `/api/profile/[username]`
- **Response** (200 OK):
```json
{
  "success": true,
  "user": {
    "id": "usr_creator_01",
    "username": "alex_rivers",
    "displayName": "Alex Rivers",
    "isFollowing": true,
    "followersCount": 14281,
    "followingCount": 382
  },
  "posts": [ ... ],
  "totalPosts": 3
}
```

---

## 4. Follow System & Multi-Stream Feed (Phase 3)

### 4.1 Toggle Follow / Unfollow User
- **Method**: `POST`
- **Path**: `/api/users/[id]/follow`
- **Headers**: Requires active session (`vybe_token` cookie or Bearer token).
- **Response** (200 OK):
```json
{
  "success": true,
  "isFollowing": true,
  "followersCount": 14281,
  "message": "User followed successfully"
}
```

### 4.2 Check Follow Status
- **Method**: `GET`
- **Path**: `/api/users/[id]/follow`
- **Response** (200 OK):
```json
{
  "success": true,
  "isFollowing": true
}
```

### 4.3 Get User Followers
- **Method**: `GET`
- **Path**: `/api/users/[id]/followers`
- **Response** (200 OK):
```json
{
  "success": true,
  "followers": [
    {
      "id": "usr_coder_02",
      "username": "maya_dev",
      "displayName": "Maya Patel",
      "isFollowing": false
    }
  ],
  "total": 1
}
```

### 4.4 Get User Following
- **Method**: `GET`
- **Path**: `/api/users/[id]/following`
- **Response** (200 OK):
```json
{
  "success": true,
  "following": [ ... ],
  "total": 2
}
```

### 4.5 Get Suggested Creators
- **Method**: `GET`
- **Path**: `/api/users/suggested`
- **Response** (200 OK):
```json
{
  "success": true,
  "users": [
    {
      "id": "usr_creator_01",
      "username": "alex_rivers",
      "displayName": "Alex Rivers",
      "isFollowing": false,
      "affinityScore": 1478.1,
      "sharedInterests": ["Video Editing", "Photography"]
    }
  ]
}
```

### 4.6 Feed Streams & Recommendation Algorithm
- **Method**: `GET`
- **Path**: `/api/posts?stream=for-you&limit=10&offset=0&community=Photography`
- **Parameters**:
  - `stream`:
    - `for-you`: Ranked via interest affinity scoring (+50 tag match, +25 hashtag match, +35 followed creator, +0.2 likes / +0.8 comments, exponential recency decay).
    - `following`: Strict chronological feed of posts by authors the current user follows + own posts.
    - `top-vybes`: Weighted engagement ranking (`likes * 2 + comments * 3 + shares * 4`).
  - `limit`: Number of posts per page (default: 10).
  - `offset`: Pagination offset.
  - `community`: Optional niche filter.
- **Response** (200 OK):
```json
{
  "success": true,
  "posts": [ ... ],
  "total": 24,
  "hasMore": true
}
```

---

## 5. Explore & Global Search (Phase 4)

### 5.1 Multi-Entity Search
- **Method**: `GET`
- **Path**: `/api/search?q=video`
- **Response** (200 OK):
```json
{
  "success": true,
  "query": "video",
  "results": {
    "users": [ ... ],
    "communities": [ ... ],
    "posts": [ ... ],
    "reels": [ ... ],
    "challenges": [ ... ],
    "events": [ ... ]
  }
}
```

---

## 6. Notifications (Phase 4)

### 6.1 Get Notifications
- **Method**: `GET`
- **Path**: `/api/notifications`
- **Response** (200 OK):
```json
{
  "success": true,
  "notifications": [ ... ],
  "unreadCount": 2
}
```

### 6.2 Mark Notification as Read
- **Method**: `PUT`
- **Path**: `/api/notifications/{id}/read`
- **Response** (200 OK):
```json
{
  "success": true,
  "notification": { ... }
}
```

### 6.3 Mark All Notifications as Read
- **Method**: `POST`
- **Path**: `/api/notifications/read-all`
- **Response** (200 OK):
```json
{
  "success": true,
  "unreadCount": 0
}
```

---

## 7. 24h Stories & Vertical Reels (Phase 5)

### 7.1 Get Stories Tray
- **Method**: `GET`
- **Path**: `/api/stories`
- **Response** (200 OK):
```json
{
  "success": true,
  "stories": [ ... ]
}
```

### 7.2 Post a Story
- **Method**: `POST`
- **Path**: `/api/stories`
- **Body**: `{ "mediaUrl": "...", "mediaType": "IMAGE" }`
- **Response** (201 Created)

### 7.3 Like a Story
- **Method**: `POST`
- **Path**: `/api/stories/{id}/like`

### 7.4 Get Reels Feed
- **Method**: `GET`
- **Path**: `/api/reels`
- **Response** (200 OK):
```json
{
  "success": true,
  "reels": [ ... ]
}
```

### 7.5 Toggle Like on Reel
- **Method**: `POST`
- **Path**: `/api/reels/{id}/like`

### 7.6 Toggle Save on Reel
- **Method**: `POST`
- **Path**: `/api/reels/{id}/save`

---

## 8. VYBES Communities, Challenges & Events (Phase 6)

### 8.1 Get All Communities
- **Method**: `GET`
- **Path**: `/api/vybes`

### 8.2 Get Single Community
- **Method**: `GET`
- **Path**: `/api/vybes/{slug}`

### 8.3 Join/Leave Community
- **Method**: `POST`
- **Path**: `/api/vybes/{slug}/join`

### 8.4 Start Community Discussion
- **Method**: `POST`
- **Path**: `/api/vybes/{slug}`
- **Body**: `{ "title": "...", "content": "..." }`

### 8.5 Get Challenges
- **Method**: `GET`
- **Path**: `/api/challenges`

### 8.6 Enter Challenge
- **Method**: `POST`
- **Path**: `/api/challenges/{id}/enter`
- **Body**: `{ "title": "...", "imageUrl": "..." }`

### 8.7 Vote on Challenge Entry
- **Method**: `POST`
- **Path**: `/api/challenges/{id}/vote`
- **Body**: `{ "entryId": "..." }`

### 8.8 Get Events
- **Method**: `GET`
- **Path**: `/api/events`

### 8.9 RSVP to Event
- **Method**: `POST`
- **Path**: `/api/events/{id}/rsvp`

---

## 9. Direct Messaging (Phase 7)

### 9.1 Get User Conversations
- **Method**: `GET`
- **Path**: `/api/messages/conversations`
- **Response** (200 OK):
```json
{
  "success": true,
  "conversations": [ ... ]
}
```

### 9.2 Get Messages for Conversation
- **Method**: `GET`
- **Path**: `/api/messages/{conversationId}`

### 9.3 Send Message
- **Method**: `POST`
- **Path**: `/api/messages/{conversationId}`
- **Body**:
```json
{
  "text": "Hey check out this DaVinci grade",
  "mediaUrl": "https://...",
  "mediaType": "IMAGE"
}
```

---

## 10. Digital Marketplace (Phase 10)

### 10.1 Get Marketplace Products
- **Method**: `GET`
- **Path**: `/api/marketplace?category=LUTS`

### 10.2 Publish Digital Product
- **Method**: `POST`
- **Path**: `/api/marketplace`
- **Body**:
```json
{
  "title": "Tokyo Noir LUTs",
  "description": "...",
  "price": 29,
  "category": "LUTS",
  "thumbnailUrl": "https://...",
  "features": ["12 LUT files", "DaVinci 19 ready"]
}
```

---

## 11. Admin & Content Moderation (Phase 11)

### 11.1 Get Admin Reports & Platform Stats
- **Method**: `GET`
- **Path**: `/api/admin/reports`
- **Response** (200 OK):
```json
{
  "success": true,
  "reports": [ ... ],
  "stats": {
    "totalUsers": 6,
    "totalPosts": 14,
    "totalCommunities": 10,
    "totalChallenges": 3,
    "totalEvents": 3,
    "pendingReports": 2
  }
}
```

### 11.2 Apply Moderation Action
- **Method**: `PUT`
- **Path**: `/api/admin/reports/{id}`
- **Body**:
```json
{
  "action": "resolve",
  "notes": "Action taken by administrator"
}
```
