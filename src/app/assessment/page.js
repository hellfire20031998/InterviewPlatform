'use client';

import { useForm } from 'react-hook-form';
import staticQuestions from './staticQuestions'; // adjust path if needed

export default function AssessmentPage() {
  const { register, handleSubmit } = useForm();

  const onSubmit = (data) => {
    const answers = Object.entries(data).map(([qid, response]) => ({
      questionId: parseInt(qid),
      response,
    }));
    console.log('Submitted answers:', answers);
    alert("Submitted (not saved to backend)");
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {staticQuestions.map((q) => (
        <div key={q.id} style={{ marginBottom: '20px' }}>
          <p><strong>{q.questionText}</strong></p>

          {q.type === 'TEXT' && (
            <input type="text" {...register(q.id.toString())} style={{ width: '100%', padding: '8px' }} />
          )}

          {q.type === 'MCQ' && q.options.map((opt) => (
            <label key={opt} style={{ display: 'block' }}>
              <input type="radio" {...register(q.id.toString())} value={opt} />
              {' '}
              {opt}
            </label>
          ))}

          {q.type === 'CHECKBOX' && q.options.map((opt) => (
            <label key={opt} style={{ display: 'block' }}>
              <input
                type="checkbox"
                {...register(q.id.toString())}
                value={opt}
              />
              {' '}
              {opt}
            </label>
          ))}
        </div>
      ))}
      <button type="submit" style={{ padding: '10px 20px', background: '#2ecc71', color: 'white', border: 'none' }}>
        Submit
      </button>
    </form>
  );
}
