---
title: Создание и подключение к комнатам (API)
atype: BCK
---

Все запросы, о которых тут будет вестись речь можно найти тут [https://daniil-shilo.gitbook.io/meetogram-docs/](https://daniil-shilo.gitbook.io/meetogram-docs/).

Все запросы делятся на открытые и закрытые.

> **Открытые запросы** - доступны в свободное использование другими разработчиками. Их можно найти на вышеупомянутом сайте.

> **Закрытые запросы** - доступны в пользование только meetogram. Это запросы, в которых требуется персональный токен пользователя, который генерируется только при подключении.

# Создание комнаты
Для создания комнаты нам потребуется запрос `/create`, который отдаст нам UUID комнаты. Мы сохраняем данный UUID, а затем показываем экран подключения пользователю. Также как только пользователь зайдет на сайт сразу же проверится есть ли `userID` в `LocalStorage` у клиента, если такового не существует, то у пользователя генерируется новый `userID` с помощью `/user/generateID`. Как только пользователь выберет нужные ему _contraints_ и нажмет "Подключиться" - отправиться запрос `/connect`. 

> **Contraints** - Специальные значения, которые нужны WebRTC, в основном это информация о медиа-потоках.

Внизу представлена полная UML диаграмма последовательности создания комнаты:

![Create Room Sequence (UML)](/architecture/bck-create-connect/create-sequence-uml.png)

# Подключение комнаты
Для подключения к комнате нам заранее нужен UUID комнаты, который мы будем передавать в URL. Однако мы не будем сразу же передавать URL, мы будем сохранять его в `LocalStorage` как `currentUUID` и отрисовывать пользователю выбор _contraints_, после того как пользователь выберет нужные ему _contraints_ - мы сразу же перейдем к подключению к комнате.

`userID` естественно тоже генерируется при переходе на страницу, если это требуется. Внизу предоставлена UML диаграмма последовательности:

![Connect to the Room Sequence (UML)](/architecture/bck-create-connect/connect-sequence-uml.png)

# Архитектура кода

Все роутеры хранятся в директории `src/routes`

Роутеры выглядят примерно следующим образом:

```typescript
// Объект для работы с базой данных
import db from "../firebase/firebase";
import { CreateRequest, GetLinkRequest } from "./apiSchema/RoomAPI";

// Создаем новый роутер
import { Router } from "express";
const Room: Router = Router();

// eslint-disable-next-line
Room.get("/create", (req, res, next) => {
  // Создаем комнату и получаем ID
  db.room
    .addRoom()
    .then((uuid) => {
      const response: CreateRequest["response"] = { uuid };
      res.send(response);
    })
    .catch((error) => {
      res.status(500).send({ message: "Something with server" });
      console.error(error);
    });
});
```