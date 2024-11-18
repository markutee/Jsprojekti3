$(document).ready(function () {
    const $taskInput = $('#taskInput');   // Haetaan tehtävän syöttökenttä jQueryllä
    const $taskForm = $('#taskForm');    // Haetaan lomake-elementti jQueryllä
    const $taskList = $('#taskList');    // Haetaan tehtävälista jQueryllä

    // Lataa tehtävät localStorage:stä ja luo ne listaan
    const savedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
    savedTasks.forEach(task => createTaskElement(task.text, task.completed));

    // Lomakkeen lähetyksen käsittely jQueryn .on()-metodilla
    $taskForm.on('submit', function (e) {
        e.preventDefault(); // Estää lomakkeen oletustoiminnan
        const taskText = $taskInput.val().trim(); // Hakee syötekentän arvon jQueryn .val()-metodilla

        if (taskText.length === 0) {
            alert('Syöte ei voi olla tyhjää. Anna vähintään 4 merkkiä.');
            $taskInput.addClass('error'); // Lisää virheluokan jQueryn .addClass()-metodilla
            return;
        } else if (taskText.length <= 3) {
            alert('Syötteen on oltava yli 3 merkkiä pitkä.');
            $taskInput.addClass('error'); // Lisää virheluokan jQueryn .addClass()-metodilla
            return;
        }

        // Luo uusi tehtävä ja lisää se listaan
        createTaskElement(taskText);
        saveTask(taskText);
        $taskInput.val('').removeClass('error'); // Tyhjentää syötekentän ja poistaa virheluokan jQueryn metodeilla
    });

    // Luo uusi tehtäväelementti
    function createTaskElement(text, completed = false) {
        const $li = $('<li>').hide(); // Luo listaelementti jQueryn avulla ja piilottaa sen aluksi
        const $taskSpan = $('<span>').text(text); // Luo span-elementti tehtävän tekstille jQueryllä

        if (completed) {
            $taskSpan.addClass('completed'); // Lisää "completed"-luokan, jos tehtävä valmis
            $li.addClass('checked'); // Lisää "checked"-luokan
        }

        // Luo "Complete"-painike ja liitä tapahtumakäsittelijä jQueryllä
        const $completeButton = $('<button>')
            .text('Complete')
            .on('click', function () {
                $taskSpan.toggleClass('completed'); // Vaihtaa "completed"-luokan jQueryn .toggleClass()-metodilla
                $li.toggleClass('checked'); // Vaihtaa "checked"-luokan
                toggleTaskCompletion(text); // Päivittää valmistumistilan localStorage:ssä
            });

        // Luo "Delete"-painike ja liitä tapahtumakäsittelijä jQueryllä
        const $deleteButton = $('<button>')
            .text('Delete')
            .on('click', function () {
                $li.fadeOut(300, function () { // Poistaa elementin jQueryn .fadeOut()-metodilla
                    $(this).remove(); // Poistaa elementin DOMista
                });
                removeTask(text); // Poistaa tehtävän localStorage:stä
            });

        // Lisää span, painikkeet ja näytä listaelementti jQueryn avulla
        $li.append($taskSpan, $completeButton, $deleteButton).appendTo($taskList).fadeIn(300); // Näyttää elementin jQueryn .fadeIn()-metodilla
    }

    // Tallenna tehtävä localStorage:en
    function saveTask(text) {
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        tasks.push({ text, completed: false });
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    // Poista tehtävä localStorage:stä
    function removeTask(text) {
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        const updatedTasks = tasks.filter(task => task.text !== text);
        localStorage.setItem('tasks', JSON.stringify(updatedTasks));
    }

    // Päivitä tehtävän valmistumistila
    function toggleTaskCompletion(text) {
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        const task = tasks.find(task => task.text === text);

        if (task) {
            task.completed = !task.completed; // Vaihtaa valmistumistilan
            localStorage.setItem('tasks', JSON.stringify(tasks)); // Tallentaa tilan localStorage:en
        }
    }
});
