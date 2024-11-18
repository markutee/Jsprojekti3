document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.querySelector('#taskInput');  // Tehtävän syöttökenttä
    const taskForm = document.querySelector('#taskForm');    // Lomake-elementti
    const taskList = document.querySelector('#taskList');    // Tehtävälista
    const error = document.querySelector('#error');          // Virheilmoitus-elementti

    // Lataa tehtävät localStorage:stä
    const savedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
    savedTasks.forEach(task => createTaskElement(task.text, task.completed));

    // Tapahtumakuuntelija lomakkeen lähettämiselle
    taskForm.addEventListener('submit', function (e) {
        e.preventDefault();  // Estää lomakkeen oletustoiminnan
        const taskText = taskInput.value.trim();  // Hae syötetyn tekstin arvot

        // Tarkista, onko syöte tyhjää tai liian lyhyt
        if (taskText.length === 0) {
            alert('Syöte ei voi olla tyhjää. Anna vähintään 4 merkkiä.');  // Ilmoitus tyhjistä syötteistä
            taskInput.classList.add('error');  // Lisää virheluokka
            return; // Lopeta toiminto
        } else if (taskText.length <= 3) {
            alert('Syötteen on oltava yli 3 merkkiä pitkä.');  // Ilmoitus liian lyhyistä syötteistä
            taskInput.classList.add('error');  // Lisää virheluokka
            return; // Lopeta toiminto
        }

        // Jos syöte on riittävän pitkä, luo uusi tehtävä
        createTaskElement(taskText);
        saveTask(taskText);
        taskInput.value = '';  // Tyhjennä syöttökenttä
        taskInput.classList.remove('error');  // Poista virheluokka
    });

    // Luo uusi tehtäväelementti tehtävälistaan
    function createTaskElement(text, completed = false) {
        const li = document.createElement('li');  // Luo uusi lista-elementti
        const taskSpan = document.createElement('span');  // Luo span-elementti tehtävän tekstille
        taskSpan.textContent = text;  // Aseta span-elementin sisältö

        // Lisää 'completed'-luokka span-elementtiin ja 'checked'-luokka li-elementtiin, jos tehtävä on valmis
        if (completed) {
            taskSpan.classList.add('completed');  // Lisää valmis-luokka span-elementtiin
            li.classList.add('checked');           // Lisää tarkastettu-luokka li-elementtiin
        }

        // Luo 'Valmis'-painike
        const completeButton = document.createElement('button');
        completeButton.textContent = 'Complete';  // Aseta painikkeen teksti
        completeButton.addEventListener('click', () => {
            taskSpan.classList.toggle('completed');  // Vaihda 'completed'-luokan tila tehtävän tekstille
            li.classList.toggle('checked');           // Vaihda 'checked'-luokan tila li-elementille
            toggleTaskCompletion(text);  // Päivitä valmistumisen tila localStorage:ssä
        });

        // Luo 'Poista'-painike
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';  // Aseta painikkeen teksti
        deleteButton.addEventListener('click', () => {
            li.remove();  // Poista tehtäväelementti listasta
            removeTask(text);  // Poista tehtävä localStorage:stä
        });

        li.appendChild(taskSpan);  // Lisää span tehtäväelementtiin
        li.appendChild(completeButton);  // Lisää 'Valmis'-painike tehtäväelementtiin
        li.appendChild(deleteButton);  // Lisää 'Poista'-painike tehtäväelementtiin
        taskList.appendChild(li);  // Lisää tehtäväelementti tehtävälistaan
    }

    // Tallenna uusi tehtävä localStorage:hen
    function saveTask(text) {
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        tasks.push({ text, completed: false });
        localStorage.setItem('tasks', JSON.stringify(tasks));  // Tallenna päivitykset
    }

    // Poista tehtävä localStorage:stä
    function removeTask(text) {
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        const updatedTasks = tasks.filter(task => task.text !== text);  // Suodata tehtävät
        localStorage.setItem('tasks', JSON.stringify(updatedTasks));  // Tallenna päivitykset
    }

    // Vaihda tehtävän valmistumisen tila ja päivitä localStorage
    function toggleTaskCompletion(text) {
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        const task = tasks.find(task => task.text === text);  // Etsi tehtävä

        if (task) {
            task.completed = !task.completed;  // Vaihda valmistumisen tila
            localStorage.setItem('tasks', JSON.stringify(tasks));  // Tallenna päivitykset
        }
    }
});
