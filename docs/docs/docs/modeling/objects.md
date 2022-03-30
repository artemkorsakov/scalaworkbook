
## Создание модулей из traits

Объекты также могут быть использованы для реализации `traits` для создания модулей. 
Эта техника использует два `trait`-а и объединяет их для создания конкретного объекта:

```scala mdoc
trait AddService:
  def add(a: Int, b: Int) = a + b
trait MultiplyService:
  def multiply(a: Int, b: Int) = a * b
object MathService extends AddService, MultiplyService
import MathService.*
add(1,1)
multiply(2,2)
```
