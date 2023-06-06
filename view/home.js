const url = 'http://localhost';


window.addEventListener('DOMContentLoaded', async () => {
    try {
        getMail();
        unsentMails();
    }
    catch (error) {
        console.log(error)
    }
})

// For Creating the Mail Schedule
async function addEmail(e) {
    try {
        e.preventDefault();
        var date = new Date(e.target.time.value);
        var now_utc = Date.UTC(date.getUTCFullYear(), date.getUTCMonth(),
            date.getUTCDate(), date.getUTCHours(),
            date.getUTCMinutes());

        const emailDetails = {
            email: e.target.email.value,
            time: new Date(now_utc),
            subject: e.target.subject.value,
            body: e.target.body.value,
        }

        e.target.email.value = '';
        e.target.time.value = '';
        e.target.subject.value = '';
        e.target.body.value = '';

        await axios.post(`${url}:3000/schedule/post`, emailDetails);
        getMail();

    }
    catch (error) {
        console.log(error);
    }
}


//For Reading the Mail Schedules
async function getMail() {
    try {
        const response = await axios.get(`${url}:3000/schedule/get`);
        document.getElementById('listOfMails').innerHTML = '';
        response.data.mails.forEach(mail => {
            const parentElement = document.getElementById('listOfMails');

            parentElement.innerHTML += `
             <li id=${mail._id}>
              ${mail.email} - ${mail.time} - ${mail.subject} - ${mail.body}  
              <button onclick='deleteMail("${mail._id}")'>Delete </button>
              <button onclick='editMail("${mail._id}", "${mail.email}", "${mail.time}", "${mail.subject}", "${mail.body}")'>Edit</button>
               </li>`;
            });

    }
    catch (error) {
        console.log(error);
    }
}

//For Deleting the Mail Schedule
async function deleteMail(mailId) {
    try {
        await axios.delete(`${url}:3000/schedule/delete/${mailId}`);
        getMail();
    }
    catch (error) {
        console.log(error);
    }
}

// For Rescheduling the Mail Schedule
async function editMail(id, email, time, subject, body) {
    try {
        document.getElementById('edit').innerHTML = '';
        console.log(id, email, time, subject, body);
        const parentElement = document.getElementById('edit');

        parentElement.innerHTML += `
        <form  onsubmit='edit(event, "${id}")' >
            <h1 >Edit Email</h1><br>

            <label for="eemail">Edit email</label>
            <input type="email" name="eemail" value=${email} required><br>

            <label for="etime">Edit Time</label>
            <input type="datetime-local" name="etime" required><br>

            <label for="esubject">Edit subject</label>
            <input type="text" name="esubject" value=${subject} required><br>

            <label for="ebody">Edit body</label>
            <textarea rows="4" name="ebody" value=${body} required></textarea><br>

            <button>Edit</button>

        </form>
        `;
    }
    catch (error) {
        console.log(error);
    }
}

// For Editing the details of Mail Schedule
async function edit(e, id) {
    try {
        e.preventDefault();
        var date = new Date(e.target.etime.value);
        var now_utc = Date.UTC(date.getUTCFullYear(), date.getUTCMonth(),
            date.getUTCDate(), date.getUTCHours(),
            date.getUTCMinutes());

        const emailDetails = {
            _id: id,
            email: e.target.eemail.value,
            time: new Date(now_utc),
            subject: e.target.esubject.value,
            body: e.target.ebody.value,
        }


        document.getElementById('edit').innerHTML = '';

        await axios.put(`${url}:3000/schedule/put`, emailDetails);
        getMail();

    }
    catch (error) {
        console.log(error);
    }
}

//For Reading the Unsent Mails
async function unsentMails() {
    try {
        const response = await axios.get(`${url}:3000/schedule/unsent`);
        if (response.status === 200) {
            document.getElementById('unsent').innerHTML = '';
            response.data.failed.forEach(mail => {
                const parentElement = document.getElementById('unsent');

                parentElement.innerHTML += `
                <li id=${mail._id}>
                ${mail.email} - ${mail.time} - ${mail.subject} - ${mail.body}  
                </li>`;
            });
        }
    }
    catch (error) {
        console.log(error);
    }
}