
const gadEnPt = {
    "instruments": [
      {
        "file_id": "fd60a9a64b1b4078a68f4bc06f20253c",
        "instrument_id": "7829ba96f48e4848abd97884911b6795",
        "instrument_name": "GAD-7 English",
        "file_name": "GAD-7 EN.pdf",
        "file_type": "pdf",
        "file_section": "GAD-7 English",
        "language": "en",
        "questions": [
          {
            "question_no": "1",
            "question_intro": "Over the last two weeks, how often have you been bothered by the following problems?",
            "question_text": "Feeling nervous, anxious, or on edge",
            "options": [
              "Not at all",
              "Several days",
              "More than half the days",
              "Nearly every day"
            ],
            "source_page": 0
          },
          {
            "question_no": "2",
            "question_intro": "Over the last two weeks, how often have you been bothered by the following problems?",
            "question_text": "Not being able to stop or control worrying",
            "options": [
              "Not at all",
              "Several days",
              "More than half the days",
              "Nearly every day"
            ],
            "source_page": 0
          }
        ]
      },
      {
        "file_id": "fd60a9a64b1b4078a68f4bc06f20253c",
        "instrument_id": "7829ba96f48e4848abd97884911b6795",
        "instrument_name": "GAD-7 Portuguese",
        "file_name": "GAD-7 PT.pdf",
        "file_type": "pdf",
        "file_section": "GAD-7 Portuguese",
        "language": "en",
        "questions": [
          {
            "question_no": "1",
            "question_intro": "Durante as últimas 2 semanas, com que freqüência você foi incomodado/a pelos problemas abaixo?",
            "question_text": "Sentir-se nervoso/a, ansioso/a ou muito tenso/a",
            "options": [
              "Nenhuma vez",
              "Vários dias",
              "Mais da metade dos dias",
              "Quase todos os dias"
            ],
            "source_page": 0
          },
          {
            "question_no": "2",
            "question_intro": "Durante as últimas 2 semanas, com que freqüência você foi incomodado/a pelos problemas abaixo?",
            "question_text": " Não ser capaz de impedir ou de controlar as preocupações",
            "options": [
              "Nenhuma vez",
              "Vários dias",
              "Mais da metade dos dias",
              "Quase todos os dias"
            ],
            "source_page": 0
          }
        ]
      }
    ],
    "query": "anxiety",
    "parameters": {
      "framework": "huggingface",
      "model": "sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2"
    }
  }

  export default gadEnPt