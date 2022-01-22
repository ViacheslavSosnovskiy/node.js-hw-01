const fs = require("fs/promises");
const path = require("path");
const { v4 } = require("uuid");

const contactsPath = path.join(__dirname, "./db/contacts.json");

async function updateContacts (contacts) {
    await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
}

async function listContacts () {
    const data = await fs.readFile(contactsPath);
    const contacts = JSON.parse(data);
    return contacts;
}
  
async function getContactById (contactId) {
    const contacts = await listContacts();
    const result = contacts.find(item => item.id === contactId);
    if(!result) {
        return null;
    }
    return result;
}
  
async function removeContact (contactId) {
    const contacts = await listContacts()
    const idx = contacts.findIndex(item => item.id === contactId)
    if(idx === -1) {
        return null
    }
    const newContacts = contacts.filter((_, index) => index !== idx)
    await updateContacts(newContacts)
    return contacts[idx]
}
  
async function addContact (name, email, phone) {
    const newContact = {id: v4(), ...name, ...email, ...phone}
    const contacts = await listContacts()
    contacts.push(newContact)
    await updateContacts(contacts)
    return newContact;
}

module.exports = {
    listContacts,
    getContactById,
    removeContact,
    addContact
}