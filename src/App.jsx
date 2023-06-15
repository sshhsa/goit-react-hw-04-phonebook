import React, { useState, useEffect } from 'react';

import Form from './components/Form/Form';
import ContactsList from './components/ContactList/ContactList';
import Filter from './components/Filter/Filter';
import Chapter from 'components/Chapter/Chapter';

import shortid from 'shortid';
import Notiflix from 'notiflix';

import css from './components/Style.module.css';

function App() {
  const [contacts, setContacts] = useState([]);
  const [filter, setFilter] = useState('');

  const handleInputChange = event => {
    const { name, value } = event.target;
    if (name === 'filter') {
      setFilter(value);
    }

    setContacts(prevContact => ({
      ...prevContact,
      [name]: value,
    }));
  };

  const handleOnSubmitForm = state => {
    if (
      contacts.find(
        contact => contact.name.toLowerCase() === state.name.toLowerCase()
      )
    ) {
      alert(`${state.name} is already in contacts!`);
      return;
    }

    const contact = {
      id: shortid.generate(),
      name: state.name,
      number: state.number,
    };
    setContacts(prevContact => [...prevContact, contact]);
  };

  const deleteEntries = idToDelete => {
    setContacts(prevState =>
      prevState.filter(contact => contact.id !== idToDelete)
    );
  };

  useEffect(() => {
    const contactsStorage = localStorage.getItem('contacts');
    const parseContactsStorage = JSON.parse(contactsStorage);

    if (parseContactsStorage) {
      setContacts(parseContactsStorage);
    }
  }, []);

  useEffect(() => {
    Notiflix.Notify.success('Your contacts was updated');
    if (contacts.length > 0) {
      localStorage.setItem('contacts', JSON.stringify(contacts));
    }
    if (contacts.length === 0) {
      localStorage.removeItem('contacts');
    }
  }, [contacts]);

  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className={css.phoneBook}>
      <div className={css.containerDefault}>
        <Chapter chapter={'Phonebook'}></Chapter>
        <Form formSubmit={handleOnSubmitForm} />
        <Chapter chapter={'Contacts'}></Chapter>
        <Filter text={filter} onChange={handleInputChange} />
        <ContactsList contacts={filteredContacts} onDelete={deleteEntries} />
      </div>
    </div>
  );
}

export default App;
