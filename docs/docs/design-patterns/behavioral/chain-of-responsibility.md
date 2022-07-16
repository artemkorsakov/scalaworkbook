---
layout: dp
title: "Chain of Responsibility"
section: dp
prev: behavioral/template-method
next: behavioral/command
---

## {{page.title}}

#### Назначение

Поведенческий шаблон проектирования, предназначенный для организации в системе уровней ответственности.
Избегайте связывания отправителя запроса с его получателем, 
предоставляя более чем одному объекту возможность обработать запрос. 
Цепляйте принимающие объекты и передайте запрос по цепочке, пока объект не обработает его. 

Идея шаблона состоит в том, чтобы отделить отправителей и получателей сообщения. 
Шаблон позволяет определить точного получателя сообщения во время выполнения.

#### Диаграмма

![Chain of Responsibility](https://upload.wikimedia.org/wikipedia/ru/a/ae/Chain.png)

#### Пример

```scala mdoc

```

```scala mdoc

```

```scala mdoc

```

```scala mdoc

```


---

**References:**
- [Scala & Design Patterns by Frederik Skeel Løkke](https://www.scala-lang.org/old/sites/default/files/FrederikThesis.pdf)
- [Wikipedia](https://ru.wikipedia.org/wiki/%D0%A6%D0%B5%D0%BF%D0%BE%D1%87%D0%BA%D0%B0_%D0%BE%D0%B1%D1%8F%D0%B7%D0%B0%D0%BD%D0%BD%D0%BE%D1%81%D1%82%D0%B5%D0%B9)
