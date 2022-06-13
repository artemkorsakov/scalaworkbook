package scaladoc.example

/** Описание класса.
  *
  * @define name
  *   заданный макрос
  * @constructor
  *   первичный конструктор
  * @param name
  *   имя персоны ($name), ссылка на класс - [[java.lang.String]]
  * @since 0.0.1
  * @author
  *   Автор кода
  * @version 0.0.2
  */
class Person(name: String):
  /** Приветственный метод.
    *
    * Вот неупорядоченный список:
    *
    *   - Первый элемент
    *   - Второй элемент
    *     - Подпункт ко второму
    *     - Еще один подпункт
    *   - Третий пункт
    *
    * Вот упорядоченный список:
    *
    *   1. Первый пронумерованный элемент
    *   1. Второй номер позиции
    *      1. Подпункт ко второму
    *      1. Еще один подпункт
    *   1. Третий пункт
    *
    * @param theGreeting
    *   приветствие ($name)
    * @param conclusion
    *   заключение
    * @tparam T
    *   описание первого параметра типа
    * @tparam V
    *   описание следующего параметра типа
    * @return
    *   приветствие для данного человека
    * @note
    *   примечание о предварительных или последующих условиях
    * @see
    *   См. [[https://docs.scala-lang.org/scala3/guides/scaladoc/docstrings.html полная документация по Scaladoc]]
    * @example
    *   {{{
    *   val p = new Person("Bob")
    *   val g = p.greet("Hello", "Have a nice day!")
    *   println(g)
    *   }}}
    */
  def greet[T, V](theGreeting: T, conclusion: V): String =
    s"$theGreeting, $name!\n$conclusion"
