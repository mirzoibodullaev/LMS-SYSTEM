# LMS System

Система управления обучением (Learning Management System) для управления курсовыми работами, студентами и заданиями.

## Технологии

- **React 19** - UI библиотека
- **TypeScript** - типизация
- **Vite** - сборщик
- **Tailwind CSS v4** - стилизация
- **TanStack Query v5** - управление данными
- **React Router v7** - маршрутизация
- **Lucide React** - иконки

## Возможности

- Аутентификация пользователей
- Управление студентами (CRUD)
- Управление заданиями (CRUD)
- Dashboard со статистикой
- Переключение темы (светлая/тёмная)
- Адаптивный дизайн для мобильных устройств

## Установка

```bash
# Клонировать репозиторий
git clone <repo-url>
cd LMS-SYSTEM

# Установить зависимости
npm install
```

## Запуск

```bash
# Режим разработки
npm run dev

# Сборка для продакшена
npm run build

# Предпросмотр продакшен сборки
npm run preview

# Проверка кода линтером
npm run lint
```

## Тестовые аккаунты

| Email | Пароль | Роль |
|-------|--------|------|
| admin@lms.com | admin | Администратор |
| teacher@lms.com | teacher | Преподаватель |

## Структура проекта

```
src/
├── api/           # API функции и mock данные
├── components/
│   ├── ui/        # UI компоненты (Card, Badge, Button, Modal, Table, Input)
│   └── layout/    # Layout компоненты (Layout, Sidebar)
├── hooks/
│   ├── queries/   # TanStack Query хуки
│   ├── useAuth.tsx    # Аутентификация
│   └── useTheme.ts    # Управление темой
├── pages/         # Страницы (Dashboard, Students, Assignments, Login)
├── types/         # TypeScript типы
└── lib/           # Утилиты
```

## Скриншоты

### Dashboard
Главная страница со статистикой и последними сдачами работ.

### Студенты
Таблица студентов с поиском, фильтрацией и CRUD операциями.

### Задания
Карточки заданий с информацией о дедлайнах и статусах.

## Лицензия

MIT
