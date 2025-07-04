-- Очищення існуючих даних, якщо вони є
SET FOREIGN_KEY_CHECKS = 0;

DELETE FROM comments;
DELETE FROM aid_requests;
DELETE FROM users;
DELETE FROM categories;

SET FOREIGN_KEY_CHECKS = 1;

-- Скидання автоінкременту
ALTER TABLE comments AUTO_INCREMENT = 1;
ALTER TABLE aid_requests AUTO_INCREMENT = 1;
ALTER TABLE users AUTO_INCREMENT = 1;
ALTER TABLE categories AUTO_INCREMENT = 1;

-- Початкові категорії
INSERT INTO categories (name) VALUES
                                  ('Продукти'),
                                  ('Ліки'),
                                  ('Одяг'),
                                  ('Засоби гігієни'),
                                  ('Побутові товари'),
                                  ('Інше');

-- Створення користувачів
INSERT INTO users (name, email, password, role) VALUES
-- Замовники
('Ірина Петренко', 'iryna@example.com', '$2b$10$u7v6hVsA3cN2C2vpgOnTZusYwNJVK8PTYRc3XYK9CL/wCKPTwMIt2', 'requester'),
('Максим Коваленко', 'maxim@example.com', '$2b$10$u7v6hVsA3cN2C2vpgOnTZusYwNJVK8PTYRc3XYK9CL/wCKPTwMIt2','requester'),
('Олена Захарченко', 'olena@example.com', '$2b$10$u7v6hVsA3cN2C2vpgOnTZusYwNJVK8PTYRc3XYK9CL/wCKPTwMIt2', 'requester'),
('Василь Мельник', 'vasyl@example.com', '$2b$10$u7v6hVsA3cN2C2vpgOnTZusYwNJVK8PTYRc3XYK9CL/wCKPTwMIt2', 'requester'),
('Наталія Бондаренко', 'natalia@example.com', '$2b$10$u7v6hVsA3cN2C2vpgOnTZusYwNJVK8PTYRc3XYK9CL/wCKPTwMIt2', 'requester'),
('Тарас Шевчук', 'taras@example.com', '$2b$10$u7v6hVsA3cN2C2vpgOnTZusYwNJVK8PTYRc3XYK9CL/wCKPTwMIt2', 'requester'),
('Ганна Лисенко', 'hanna@example.com', '$2b$10$u7v6hVsA3cN2C2vpgOnTZusYwNJVK8PTYRc3XYK9CL/wCKPTwMIt2', 'requester'),
('Петро Савченко', 'petro@example.com', '$2b$10$u7v6hVsA3cN2C2vpgOnTZusYwNJVK8PTYRc3XYK9CL/wCKPTwMIt2', 'requester'),

-- Волонтери
('Марія Іваненко', 'maria@example.com', '$2b$10$u7v6hVsA3cN2C2vpgOnTZusYwNJVK8PTYRc3XYK9CL/wCKPTwMIt2', 'volunteer'),
('Олександр Ткаченко', 'oleksandr@example.com', '$2b$10$u7v6hVsA3cN2C2vpgOnTZusYwNJVK8PTYRc3XYK9CL/wCKPTwMIt2', 'volunteer'),
('Юлія Мороз', 'yulia@example.com', '$2b$10$u7v6hVsA3cN2C2vpgOnTZusYwNJVK8PTYRc3XYK9CL/wCKPTwMIt2', 'volunteer'),
('Андрій Кравчук', 'andriy@example.com', '$2b$10$u7v6hVsA3cN2C2vpgOnTZusYwNJVK8PTYRc3XYK9CL/wCKPTwMIt2', 'volunteer'),
('Вікторія Зінченко', 'viktoria@example.com', '$2b$10$u7v6hVsA3cN2C2vpgOnTZusYwNJVK8PTYRc3XYK9CL/wCKPTwMIt2', 'volunteer'),
('Роман Павленко', 'roman@example.com', '$2b$10$u7v6hVsA3cN2C2vpgOnTZusYwNJVK8PTYRc3XYK9CL/wCKPTwMIt2', 'volunteer');

-- Створення запитів на допомогу
INSERT INTO aid_requests (category_id, requester_id, volunteer_id, title, description, budget, priority, city, region, status, created_at) VALUES
-- Очікує на виконавця
(1, 1, NULL, 'Потрібні продукти харчування для сім\'ї', 'Сім\'я з 4 осіб потребує базовий набір продуктів харчування: крупи, макарони, консерви, олія, цукор', 1200.00, 'Високий', 'Київ', 'Київська область', 'Очікує на виконавця', '2025-04-10 08:30:00'),
(2, 2, NULL, 'Термінові ліки для дитини', 'Потрібні антибіотики для дитини 5 років. Рецепт додам у коментарях.', 800.00, 'Високий', 'Львів', 'Львівська область', 'Очікує на виконавця', '2025-04-23 10:15:00'),
(3, 5, NULL, 'Зимовий одяг для родини', 'Родина з Херсонської області, переселенці. Потрібен теплий одяг на зиму для двох дорослих та трьох дітей (7, 10, 15 років).', 3000.00, 'Середній', 'Дніпро', 'Дніпропетровська область', 'Очікує на виконавця', '2025-04-28 14:45:00'),
(5, 6, NULL, 'Допомога з побутовою технікою', 'Потрібна допомога з придбанням електроплити. Стара вийшла з ладу, а коштів на нову немає.', 5000.00, 'Середній', 'Запоріжжя', 'Запорізька область', 'Очікує на виконавця', '2025-05-02 11:30:00'),

-- В роботі
(1, 7, 9, 'Продукти для літньої людини', 'Пенсіонерка, 78 років, потребує допомоги з доставкою продуктів раз на тиждень.', 500.00, 'Середній', 'Житомир', 'Житомирська область', 'В роботі', '2025-04-15 09:45:00'),
(4, 8, 10, 'Засоби гігієни для родини', 'Багатодітна родина потребує засобів гігієни: мило, шампунь, зубна паста, пральний порошок.', 600.00, 'Низький', 'Вінниця', 'Вінницька область', 'В роботі', '2025-04-18 13:20:00'),
(2, 3, 11, 'Ліки для хронічного хворого', 'Потрібні ліки для підтримки серцево-судинної системи. Щомісячний прийом, доза вказана у рецепті.', 1500.00, 'Високий', 'Одеса', 'Одеська область', 'В роботі', '2025-04-20 15:10:00'),
(6, 4, 12, 'Допомога з ремонтом даху', 'Після обстрілу пошкоджено дах. Потрібні будматеріали для ремонту та можливо волонтерська допомога з виконанням робіт.', 8000.00, 'Високий', 'Харків', 'Харківська область', 'В роботі', '2025-04-22 16:35:00'),

-- Виконано
(1, 1, 13, 'Продукти для дитячого будинку', 'Дитячий будинок потребує базові продукти харчування для 15 дітей віком від 5 до 12 років.', 2500.00, 'Високий', 'Київ', 'Київська область', 'Виконано', '2025-03-10 10:00:00'),
(5, 2, 14, 'Побутова хімія для притулку', 'Притулок для тимчасово переміщених осіб потребує засоби для прибирання, прання та миття посуду.', 1200.00, 'Середній', 'Львів', 'Львівська область', 'Виконано', '2025-03-15 11:30:00'),
(3, 3, 10, 'Одяг для новонароджених', 'Молода мама-одиначка потребує одяг для новонародженої дитини та засоби догляду.', 800.00, 'Високий', 'Одеса', 'Одеська область', 'Виконано', '2025-03-20 14:15:00'),

-- Скасовано
(6, 4, NULL, 'Допомога з переїздом', 'Потрібна допомога з перевезенням речей на нову квартиру.', NULL, 'Низький', 'Харків', 'Харківська область', 'Скасовано', '2025-03-25 09:15:00'),
(4, 5, 13, 'Засоби гігієни для лікарні', 'Лікарня потребує засоби гігієни для пацієнтів.', 3000.00, 'Середній', 'Дніпро', 'Дніпропетровська область', 'Скасовано', '2025-03-28 13:45:00');

-- Створення коментарів
INSERT INTO comments (request_id, user_id, text, created_at) VALUES
-- Коментарі до запитів в очікуванні
(1, 1, 'Можна приїхати за адресою вул. Шевченка 45, кв. 12. Домофон 12.', '2025-04-10 09:15:00'),
(2, 2, 'Додаю фото рецепту: [посилання на фото]. Терміново потрібен препарат Амоксиклав.', '2025-04-23 10:25:00'),
(3, 5, 'Розміри одягу: чоловік - L, жінка - M, діти - 128, 140, 158.', '2025-04-28 15:00:00'),

-- Коментарі до запитів в роботі
(5, 7, 'Найзручніший час для доставки - з 10:00 до 13:00, бо потім йду до лікаря.', '2025-04-15 10:00:00'),
(5, 9, 'Добре, буду доставляти продукти щосереди о 10:30. Що саме потрібно з продуктів?', '2025-04-15 10:30:00'),
(5, 7, 'Хліб, молоко, сир, масло, яйця, крупи, овочі, фрукти. Дякую за допомогу!', '2025-04-15 11:00:00'),

(6, 8, 'Найкраще приїхати у вихідні, ми всі вдома.', '2025-04-18 14:00:00'),
(6, 10, 'Гаразд, приїду у суботу о 12:00. Які саме засоби гігієни потрібні?', '2025-04-18 14:30:00'),
(6, 8, 'Мило, шампунь, зубна паста, пральний порошок, засіб для миття посуду. Дякую!', '2025-04-18 15:00:00'),

(7, 3, 'Рецепт на препарати Конкор та Аспірин кардіо. Можу надіслати фото рецепта.', '2025-04-20 15:30:00'),
(7, 11, 'Будь ласка, надішліть фото. Коли зручно доставити ліки?', '2025-04-20 16:00:00'),
(7, 3, 'Будь-який день після 17:00. Дякую за допомогу!', '2025-04-20 16:30:00'),

-- Коментарі до виконаних запитів
(9, 1, 'Список продуктів: крупи, макарони, олія, цукор, чай, молоко, хліб, фрукти.', '2025-03-10 10:30:00'),
(9, 13, 'Закупив усе за списком. Коли зручно доставити?', '2025-03-10 14:00:00'),
(9, 1, 'Будь ласка, у середу з 9:00 до 12:00.', '2025-03-10 15:00:00'),
(9, 13, 'Доставив продукти. Будь ласка, підтвердіть отримання.', '2025-03-12 10:30:00'),
(9, 1, 'Підтверджую отримання. Величезна подяка за допомогу!', '2025-03-12 11:00:00'),

-- Коментарі до скасованих запитів
(12, 4, 'Вибачте, але проблема вирішилась. Запит більше не актуальний.', '2025-03-26 10:00:00');