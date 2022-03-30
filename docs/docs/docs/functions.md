---
layout: docs
title: "Функции первого класса"
---

## {{page.title}}

Scala обладает большинством возможностей, ожидаемых от функционального языка программирования, включая:
- Лямбды (анонимные функции)
- Функции высшего порядка (HOFs)
- Неизменяемые коллекции в стандартной библиотеке

Лямбды, также известные как анонимные функции, играют важную роль в том, чтобы код был кратким, но читабельным.

Эти два примера эквивалентны и показывают, как умножить каждое число в списке на 2, передав лямбду в метод `map`:

```scala mdoc
List(1, 2, 3).map(i => i * 2)
List(1, 2, 3).map(_ * 2)
```

Метод `map` класса `List` является типичным примером функции более высокого порядка - функции, которая принимает функцию в качестве параметра.

Эти примеры также эквивалентны следующему коду, который использует метод `double` вместо лямбда:

```scala mdoc
def double(i: Int): Int = i * 2
List(1, 2, 3).map(i => double(i))
List(1, 2, 3).map(double)   
```

## Неизменяемые коллекции

В процессе работы с неизменяемыми коллекциями, такими как `List`, `Vector` и неизменяемыми классами `Map` и `Set`, 
важно помнить, что их функции не изменяют коллекцию, для которой они вызываются; 
вместо этого они возвращают новую коллекцию с обновленными данными. 
В результате принято связывать их вместе в "fluent" стиле для решения проблем.

В этом примере показано, как дважды отфильтровать коллекцию, а затем умножить каждый элемент в оставшейся коллекции:

```scala mdoc
val nums = (1 to 10).toList
val x = nums.filter(_ > 3)
  .filter(_ < 7)
  .map(_ * 10)  
```

> **P.S.** Пример призван показать только то, как принято последовательно вызывать функции на неизменяемых коллекциях.
Его недостаток в том, что обход коллекции происходит целых три раза. 
Чтобы получить аналогичный результат за единичный обход коллекции, достаточно: 
`nums.withFilter(n => 3 < n && n < 7).map(_ * 10)`

---

**References:**
- [Scala3 book](https://docs.scala-lang.org/scala3/book/taste-functions.html)