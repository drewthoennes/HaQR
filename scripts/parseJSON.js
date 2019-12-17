/*
 * parseJson
 *
 * node parseJson.js users.json applications.json
 *
 * @args
 * users.json           Path to JSON for users table (uses columns user_id, first_name, last_name)
 * applications.json    Path to JSON for applications table (uses columns id, email, rsvp)
 */

const fs = require('fs');
const idLength = 13;

if (process.argv.length < 4) {
    console.error('Please provide two paths to the users JSON file and the applications JSON file');
    return;
}

const getFiles = async () => {
    let users = await JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
    let applications = await JSON.parse(fs.readFileSync(process.argv[3], 'utf8'));

    // Create an array of unique ids
    let ids = [];
    while (ids.length != applications.length) {
        let id = Math.floor(Math.random() * Math.pow(10, idLength));

        if (!ids.includes(id)) {
            ids.push(id);
        }
    }

    // Construct profiles for importing
    let profiles = applications.map(application => {
        let user = users.find(candidate => {
            return candidate.id === application.user_id;
        });

        if (!user) return;

        return Object.assign({}, application, user);
    }).map((profile, index) => {
        return {
            name:   `${profile.first_name} ${profile.last_name}`,
            email:  profile.email,
            notes:  `RSVP'd: ${profile.rsvp ? 'Yes' : 'No'}`,
            qr: `${ids[index]}`
        }
    });

    // Create CSV
    let csv = '';
    profiles.forEach(profile => {
        csv += `${profile.name}, ${profile.email}, ${profile.notes}, ${profile.qr}\n`;
    });

    // Remove last new line character
    if (csv.length > 1) csv = csv.substring(0, csv.length - 1);

    console.log(csv);
}

getFiles();
