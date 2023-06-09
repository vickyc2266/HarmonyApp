import '../css/BookletPage.css';

function Page({ id, text, options, onAnswer }) {

  return (
    <div className="Booklet-Page" data-qid={id}>
      <h2>{ text }</h2>
      <h3>{ options }</h3>
    </div>
  );
}

export default Page;