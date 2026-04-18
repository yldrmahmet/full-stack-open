const Persons = ({ contacts, onClick }) => {
  return (
    <>
      {contacts.map((contact) => (
        <div key={contact.id}>
          <p>
            {contact.name} {contact.number}
            {" "}<button
              onClick={() => {
                onClick(contact.id);
              }}
            >
              delete
            </button>
          </p>
        </div>
      ))}
    </>
  );
};

export default Persons;
