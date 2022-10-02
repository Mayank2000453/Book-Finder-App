
# Book Finder

An application that allows users to locate books faster by entering the query.
 For instance, a query could be the name of the author or even the name and title for the title. 
While not a full-blown app, but rather a component of an app, it's a good project nonetheless. 




## Features

- An input area is required for users to input their search queries. The core concept is searching with basic user actions. 
- Learning Materials and lightning-fast product search interface of such individual files is the fundamental concept. 
- Fullscreen mode
- Pagination Control and visual representations are excellent ideas for the user interface design.





## Screenshots
- Home Page
![Home Page](https://github.com/Mayank2000453/Book-Finder-App/blob/master/Show/1st.png?raw=true)

- Register
![Home Page](https://github.com/Mayank2000453/Book-Finder-App/blob/master/Show/2nd.png?raw=true)

- Search
![Home Page](https://github.com/Mayank2000453/Book-Finder-App/blob/master/Show/3rd.png?raw=true)

- Result in JSON
![Home Page](https://github.com/Mayank2000453/Book-Finder-App/blob/master/Show/4th.png?raw=true)
## API Reference

#### Get books

```http
  GET /books/:bookKind
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `bookKind`      | `string` | **Required**. Name of book |


#### Read User Details
```http
  GET /register/:name
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `name`      | `string` | **Required**. Name of user |



#### Update Email
```http
  PATCH /register/:name
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `name`      | `string` | **Required**. Name of user |

#### Delete User
```http
  DELETE /register/:name
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `name`      | `string` | **Required**. Name of user |

#### Purchase and Sell History
```http
  GET /register/history/:name
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `name`      | `string` | **Required**. Name of user |



## Tech Stack

**DataBase:** MongoDB

**Server:** Node, Express

**Design:** Html, CSS, Boostrap

**Script:** JavaScript
## Authors

- [@Mayank Raman](https://github.com/Mayank2000453)
