(function () {
    'use strict'; /* ograniczona wersja JS'a */

    var draggedEl,
        onDragStart,
        onDrag,
        onDragEnd,
        getNoteObject,
        grabPointY,
        grabPointX,
        createNote,
        addNoteBtnEl,
        onAddNoteBtnClick,
        saveNote,
        deleteNote,
        loadNotes,
        init,
        testLocalStorage;

    onDragStart = function (ev) {
        var boundingClientRect;
        if (ev.target.className.indexOf('bar') === -1) {
            return; /* sprawdzam czy element za ktory chce przeciagnac ma klase bar, jak nie posiada to nie wywołuję */
        }

        draggedEl = this; /* jeżeli chwiciliśmy za bar, przypisuje this'a teraz odwołuje się do sticker'a */

        boundingClientRect = draggedEl.getBoundingClientRect(); /* pozycja w przegladarce danego elementu */

        grabPointY = boundingClientRect.top - ev.clientY; /* pozycja od góry i od lewej strony */
        grabPointX = boundingClientRect.left - ev.clientX;
    };

    onDrag = function (ev) {
        if (!draggedEl) { /* jesl nie nie przeciagamy zadnego elementu funkcji nie wywołujemy */
            return;
        }

        var posX = ev.clientX + grabPointX, /* przesuniecie, nowa pozycja notesu */
            posY = ev.clientY + grabPointY;

        if (posX < 0) {
            posX = 0; /* blokowanie przeciągniecia poza okno przeglądarki poz. X oraz poz. Y */
        }

        if (posY < 0) {
            posY = 0;
        }

        draggedEl.style.transform = "translateX(" + posX + "px) translateY(" + posY + "px)"; /* przesuwanie na translat'ach, przesuwanie o pozycję */
    };

    onDragEnd = function () {
        draggedEl = null;
        grabPointX = null; /* zerujemy wszystkie punkty */
        grabPointY = null;
    };

    getNoteObject = function (el) {
        var textarea = el.querySelector('textarea');
        return {
            transformCSSValue: el.style.transform,
            content: textarea.value,
            id: el.id,
            textarea: {
                width: textarea.style.width,
                height: textarea.style.height,
            }
        };
    };

    onAddNoteBtnClick = function () {
        createNote();
    };

    createNote = function (options) {
        var stickerEl = document.createElement('div'),
            barEl = document.createElement('div'),
            saveBtnEl = document.createElement('button'), /* definiowanie elementów notatki tak by nie towrzyć jedne tylko ile chcemy */
            deleteBtnEl = document.createElement('button'),
            textareaEl = document.createElement('textarea'),
            BOUNDARIES = 500,
            noteConfig = options || {
                transformCSSValue: "translateX(" + Math.random() * BOUNDARIES + "px) translateY(" + Math.random() * BOUNDARIES + "px)",
                content: '', /* losowość miejsca tworzenia nowe notatki */
                id: "sticker_" + new Date().getTime(),
            },
            onSave,
            onDelete;

        if (noteConfig.textarea) {
            textareaEl.style.width = noteConfig.textarea.width;
            textareaEl.style.height = noteConfig.textarea.height;
            textareaEl.style.resize = 'both';
        }

        onSave = function () {
            saveNote(
                getNoteObject(stickerEl) /* wywołanie fucnkji save czyli zapisania notatki */
            );
        };

        onDelete = function () {
            deleteNote(
                getNoteObject(stickerEl) /* wywołanie funkcji delete czyli usuniecia notatki */
            );

            document.body.removeChild(stickerEl);
        };

        stickerEl.style.transform = noteConfig.transformCSSValue; /* przypisanie wartości aby była ta notka w losowym miesjcu */
        stickerEl.id = noteConfig.id;
        textareaEl.value = noteConfig.content;

        saveBtnEl.innerText = 'S';
        saveBtnEl.classList.add('saveButton'); /* dodawanie klasy do elementu utworzonego przez  funkcje create element */
        saveBtnEl.addEventListener('click', onSave, false);

        deleteBtnEl.innerText = 'X';
        deleteBtnEl.classList.add('deleteButton');
        deleteBtnEl.addEventListener('click', onDelete, false);

        barEl.classList.add('bar');
        stickerEl.classList.add('sticker');

        barEl.appendChild(saveBtnEl); /* dodanie buttonów do bar'u */
        barEl.appendChild(deleteBtnEl);

        stickerEl.appendChild(barEl); /* dopisywanie do sticekerel odpowwiednich rzeczy ktore w nic chcemy miec */
        stickerEl.appendChild(textareaEl);

        stickerEl.addEventListener('mousedown', onDragStart, false);

        document.body.appendChild(stickerEl); /* to wszystko ma sie znajdować w body */
    };

    testLocalStorage = function () {
        var foo = 'foo';
        try {
            localStorage.setItem(foo, foo);
            localStorage.removeItem(foo); /* funkacja która sprawdza czy możemy użyć localstorage */
            return true; 
        } catch (e) {
            return false;
        }
    };

    init = function () { /* funkcja która wywołuje się przy uruchomieniu programu */

        if (!testLocalStorage) {
            var message = "We are sorry but you cannot use localStorage"; /* sprawdzam czy testlocalstorage wyrzucił nam jakiś błąd */
            saveNote = function () {
                console.warn(message); 
            };

            deleteNote = function () {
                console.warn(message);
            };
        } else { /* jeżeli localstroge jest ok */
            saveNote = function (note) {
            localStorage.setItem(note.id, JSON.stringify(note));
            };

            deleteNote = function (note) { /* ładujemy wszsytkie te 3 funkcje */
                localStorage.removeItem(note.id);
            };

            loadNotes = function () {
                for (var i = 0; i < localStorage.length; i++) {
                    var noteObject = JSON.parse(
                        localStorage.getItem(
                            localStorage.key(i)
                        )
                    );
                    createNote(noteObject);
                };
            };
            loadNotes();
        }

        addNoteBtnEl = document.querySelector('.addNoteBtn');
        addNoteBtnEl.addEventListener('click', onAddNoteBtnClick, false); /* nasłuchwianie przycisku na button tworzenia notatki i jego wywoływanie */
        document.addEventListener('mousemove', onDrag, false); /* nasłuchiwanie na zdarzenie, poruszam myszka i ona sie wywołuje */
        document.addEventListener('mouseup', onDragEnd, false); /* gdy puszczamy myszkę wywołujemy ondrag end */
    };

    init();

    function clock() {
        var now = new Date();
        var ctx = document.getElementById('canvas').getContext('2d');
        ctx.save();
        ctx.clearRect(0, 0, 150, 150);
        ctx.translate(75, 75);
        ctx.scale(0.4, 0.4);
        ctx.rotate(-Math.PI / 2);
        ctx.strokeStyle = 'black';
        ctx.fillStyle = 'white';
        ctx.lineWidth = 8;
        ctx.lineCap = 'round';
      
        // Hour marks
        ctx.save();
        for (var i = 0; i < 12; i++) {
          ctx.beginPath();
          ctx.rotate(Math.PI / 6);
          ctx.moveTo(100, 0);
          ctx.lineTo(120, 0);
          ctx.stroke();
        }
        ctx.restore();
      
        // Minute marks
        ctx.save();
        ctx.lineWidth = 5;
        for (i = 0; i < 60; i++) {
          if (i % 5!= 0) {
            ctx.beginPath();
            ctx.moveTo(117, 0);
            ctx.lineTo(120, 0);
            ctx.stroke();
          }
          ctx.rotate(Math.PI / 30);
        }
        ctx.restore();
       
        var sec = now.getSeconds();
        var min = now.getMinutes();
        var hr  = now.getHours();
        hr = hr >= 12 ? hr - 12 : hr;
      
        ctx.fillStyle = 'black';
      
        // write Hours
        ctx.save();
        ctx.rotate(hr * (Math.PI / 6) + (Math.PI / 360) * min + (Math.PI / 21600) *sec);
        ctx.lineWidth = 14;
        ctx.beginPath();
        ctx.moveTo(-20, 0);
        ctx.lineTo(80, 0);
        ctx.stroke();
        ctx.restore();
      
        // write Minutes
        ctx.save();
        ctx.rotate((Math.PI / 30) * min + (Math.PI / 1800) * sec);
        ctx.lineWidth = 10;
        ctx.beginPath();
        ctx.moveTo(-28, 0);
        ctx.lineTo(112, 0);
        ctx.stroke();
        ctx.restore();
       
        // Write seconds
        ctx.save();
        ctx.rotate(sec * Math.PI / 30);
        ctx.strokeStyle = '#D40000';
        ctx.fillStyle = '#D40000';
        ctx.lineWidth = 6;
        ctx.beginPath();
        ctx.moveTo(-30, 0);
        ctx.lineTo(83, 0);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(0, 0, 10, 0, Math.PI * 2, true);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(95, 0, 10, 0, Math.PI * 2, true);
        ctx.stroke();
        ctx.fillStyle = 'rgba(0, 0, 0, 0)';
        ctx.arc(0, 0, 3, 0, Math.PI * 2, true);
        ctx.fill();
        ctx.restore();
      
        ctx.beginPath();
        ctx.lineWidth = 14;
        ctx.strokeStyle = '#696e9e';
        ctx.arc(0, 0, 142, 0, Math.PI * 2, true);
        ctx.stroke();
      
        ctx.restore();
      
        window.requestAnimationFrame(clock);
      }

      window.requestAnimationFrame(clock);

})();