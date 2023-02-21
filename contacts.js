const fs = require("fs").promises;
const path = require("path");
require("colors");
const { nanoid } = require("nanoid");

const contactsPath = path.join(__dirname, "db", "contacts.json");

async function listContacts() {
  try {
    const contacts = await fs.readFile(contactsPath, { encoding: "utf-8" });
    return JSON.parse(contacts);
  } catch (error) {
    console.log(error.red);
  }
}

async function getContactById(contactId) {
  try {
    const contacts = await listContacts();
    const isContact = contacts.find(({ id }) => id === contactId);
    if (!isContact) {
      return console.log(`There is no contact with id:${contactId}`);
    }
    return isContact;
  } catch (error) {
    console.log(error.red);
  }
}

async function removeContact(contactId) {
  try {
    const contacts = await listContacts();
    const isContact = contacts.findIndex((contact) => contact.id === contactId);
    if (isContact === -1) {
      return console.log(`There is no contact with such id:${contactId}`.cyan);
    }
    const updateContacts = contacts.filter(({ id }) => id !== contactId);
    await fs.writeFile(contactsPath, JSON.stringify(updateContacts, null, 2), {
      encoding: "utf-8",
    });
    console.log(`The contact with id:${contactId} was deleted.`.cyan);
    return updateContacts;
  } catch (error) {
    console.log(error.red);
  }
}

async function addContact(name, email, phone) {
  try {
    const contacts = await listContacts();
    if (contacts.find((contact) => contact.name === name)) {
      return console.log("The contact is already added.".cyan);
    }
    const newContact = {
      id: nanoid(),
      name,
      email,
      phone,
    };
    const newContacts = [newContact, ...contacts];
    await fs.writeFile(contactsPath, JSON.stringify(newContacts, null, 2), {
      encoding: "utf-8",
    });
    console.log("The contact was added.".cyan);
    return newContact;
  } catch (error) {
    console.log(error.red);
  }
}

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
};
