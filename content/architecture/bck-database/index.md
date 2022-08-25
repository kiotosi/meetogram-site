---
title: Архитектура модели базы данных
atype: BCK
---

Базой данных в приложении является [Firebase](https://firebase.google.com), это NOSQL база данных, которая базируется на принципе коллекций и документов. Коллекция может содержать в себе документы, документы могут содержать вложенные коллекции и данные.

Интерфейс для модели базы данных будет выглядеть так (если мы не будем учитывать, что мы не можем обращаться к документам без коллекций):

```typescript
interface Room {
  id: string,
  userList: User[]
}

interface User {
  id: string,
  contraints: UserContraints
}

interface UserContraints {
  audio: boolean,
  video: boolean
}
```
<small>Интерфейс для документов `Room` и `User`</small>

UML ER Diagram будет выглядеть следующим образом:

![UML ER](/architecture/bck-database/er-diagram.png)

<small>UML диаграмма для Firebase</small>

> Все UML диаграммы можно найти в [репозитории для документации](https://github.com/crackidocky/meetogram-site). В корне репозитория есть файл `meetogram.mdj`, это файл StarUML, который в свою очередь является редактором UML диаграм.

`RoomCollection` будет отвечать за коллекцию комнат. Документы в ней будут создаваться по запросу `/create`.
UserCollection будет содержать пользователей для для определенной комнаты. `id` в ней будет генерироваться с помощью `UserCounterDocument`.

В целом все UUID будут генерироваться с помощью коллекции `CounterCollection`. Так как Firebase не содержит полей, которые автоинкрементируются - приходится использовать счетчики в отдельных коллекциях.

# Архитектура кода

В целом весь код будет написан в `src/firebase`. Внутри будут две директории:

* `schemas` - TypeScript-интерфейсы для базы данных
* `collections` - Коллекции для Firebase. Это будут классы, которые можно будет инициализировать, чтобы работать с разными БД

Главный файл `firebase.ts` будет обычным [фасадом](https://refactoring.guru/ru/design-patterns/facade), который будет содержать классы с коллекциями и предоставлять их функционал пользователю. Классы коллекции внутри `collections` в свою очередь тоже будут являться фасадами, которые будут выполнять CRUD-операции непосредственно со своими коллекциями.

Пример одной из коллекций:

```typescript
// Room collection
import { RoomSchema } from "../schemas/room";

class Room {
  private readonly _collectionName = "Room";
  private _collection: firestore.CollectionReference<firestore.DocumentData>;
  private _roomCounter: RoomCounter;

  /**
   * Класс для работы с коллекцией комнат
   * @param {firestore.Firestore} database База данных в которой ведется работа
   */
  constructor(database: firestore.Firestore) {
    // Коллекция комнат
    this._collectionName = "Room";
    this._collection = firestore.collection(database, this._collectionName);

    // Коллекция с ID комнат
    this._roomCounter = new Counter(database).room;
  }

  /**
   * Метод, который создает новую комнату в базе данных
   * @returns UUID новой комнаты
   */
  async addRoom(): Promise<string | undefined> {
  }

  /**
   * Удаляет нужную нам комнату по uuid
   * @returns Список удаленных комнат
   */
  async removeRoom(uuid: string): Promise<string[]> {
  }

  /**
   * Находит документы комнат в коллекции исходя из uuid
   * @param uuid Уникальный идентификатор комнаты
   * @returns Документы, которые подошли под запрос
   */
  private async _getRooms(uuid: string) {
  }
}
```

Главный файл `firebase.ts` будет просто импортировать все коллекции и экспортировать их в одном объекте, чтобы `firebase.ts` был единственной точкой входа:

```typescript

// Модули для работы с базой данных
import Room from "./collections/Room";

// Вспомогательные модули
import { isDev } from "../utils/nodeEnvMode";
const isDevMode = isDev();

// Выводим конфигурацию Firebase
// Эта проверка нужна для того чтобы убедиться что конфигурация существует и вы не забыли ее создать
// INFO: Выводится только в режиме разработчика
if (isDevMode) {
  console.log("Logging out firebase config!", firebaseConfig);
}

// Инициализируем приложение и базу данных
const app = firebaseApp.initializeApp(firebaseConfig);
const database = firestore.getFirestore(app);

const db = {
  room: new Room(database),
};

export default db;
```