# Metar weather decoder. Ресурс для поиска и расшифровки метеорологических сводок. :sun_behind_small_cloud:

### В проекте реализовано:

* Запрос и получение данных через API [`checkwxapi`](https://www.checkwxapi.com/documentation/metar).
* Анимация во время загрузки данных.
* Расшифровка и вывод обработанных данных о погоде в текстовом формате.
* Адаптивная верстка

### Справка
`METAR (METeorological Aerodrome Report)` — авиационный метеорологический код для передачи сводок о фактической погоде на аэродроме. 

Пример сводки для аэропорта Шереметьево, Москва (код `ICAO`: UUEE):

`UUEE 291200Z 21004MPS 170V230 8000 -RA OVC018 15/12 Q1014 R24L/290051 R24C/290051 NOSIG`

### О ресурсе
Данный ресурс позволяет искать метеорологические сводки по `ICAO`-коду любого действующего аэропорта в мире. В проекте реализована автоматическая расшифровка метеоданных из формата `METAR` в обычный текст.

### Использование
По-умолчанию, в проекте подгружается сводка с актуальными метеоданными в аэропорту Шереметьево, Москва. Чтобы найти информацию о погоде в другом аэропорту, необходимо указать в поиске `ICAO`-код искомого аэропорта. 
Примеры `ICAO`-кодов:
* `LEBL` - аэропорт Эль Прат, Барселона.
* `LZHS` - аэропорт города Цюрих.
* `KJFK` - аэропорт имени Д.Кеннеди, Нью-Йорк.
* `URSS` - аэропорт Сочи.

### Стек:

* HTML · CSS · JS

### Ссылки

Вы можете ознакомиться с ресурсом, перейдя по [`ссылке`](https://leonidparshentsev.github.io/Metar_decoder/).

---

# Metar weather decoder. A resource for searching and decoding meteorological reports. :sun_behind_small_cloud:

### Implemented in the project:

* Requesting and receiving data via the API [`checkwxapi`](https://www.checkwxapi.com/documentation/metar).
* Animation during data loading.
* Decode and output of weather data in text format.
* Adaptive layout.

### Reference
`METAR (METeorological Aerodrome Report)` — is a format for reporting weather information.

Example of a weather information for Sheremetyevo Airport, Moscow (code `ICAO`: UUEE):

`UUEE 291200Z 21004MPS 170V230 8000 -RA OVC018 15/12 Q1014 R24L/290051 R24C/290051 NOSIG`

### About
This resource allows you to search for meteorological reports by the `ICAO` code of any operating airport in the world. The project implements automatic decoding of weather data from the 'METAR` format into plain text.

### Usage
By default, the project loads a information with up-to-date weather data at Sheremetyevo Airport, Moscow. To find weather information at another airport, you must specify the `ICAO` code of the airport you are looking for in the search.
`ICAO' codes examples:
* `LEBL` - Barcelona-El Prat Airport.
* `LZHS` - Zürich Airport.
* `KJFK` - John F Kennedy International Airport, New-York.
* `URSS` - Sochi International Airport.

### Stack:

* HTML · CSS · JS

### Links

You can check out the resource on the [`link`](https://leonidparshentsev.github.io/Ambience_studio/).
