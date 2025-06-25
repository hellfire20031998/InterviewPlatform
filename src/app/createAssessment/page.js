'use client';

import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { useState } from 'react';
import axios from 'axios';

export default function CreateAssessment() {
  const { register, control, handleSubmit, watch } = useForm({
    defaultValues: {
      questions: [{ questionText: '', type: 'TEXT', options: [''] }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'questions',
  });

  const watchQuestions = watch('questions');

  const onSubmit = async (data) => {
    const token = localStorage.getItem('token');
    try {
      for (const question of data.questions) {
        await axios.post('http://localhost:8081/api/questions/create', question, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      alert('Assessment saved!');
    } catch (error) {
      console.error(error);
      alert('Failed to save assessment');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} style={styles.form}>
      <h1>Create Assessment</h1>

      {fields.map((field, index) => {
        const currentType = watchQuestions[index]?.type || 'TEXT';

        return (
          <div key={field.id} style={styles.questionBox}>
            <input
              {...register(`questions.${index}.questionText`, { required: true })}
              placeholder="Enter question"
              style={styles.input}
            />

            <select {...register(`questions.${index}.type`)} style={styles.select}>
              <option value="TEXT">Text</option>
              <option value="MCQ">MCQ</option>
              <option value="CHECKBOX">Checkbox</option>
            </select>

            {(currentType === 'MCQ' || currentType === 'CHECKBOX') && (
              <div style={styles.options}>
                <Controller
                  name={`questions.${index}.options`}
                  control={control}
                  render={({ field: { value, onChange } }) => (
                    <div>
                      {value.map((option, optIndex) => (
                        <div key={optIndex} style={{ display: 'flex', marginBottom: '5px' }}>
                          <input
                            type="text"
                            value={option}
                            onChange={(e) => {
                              const updated = [...value];
                              updated[optIndex] = e.target.value;
                              onChange(updated);
                            }}
                            placeholder={`Option ${optIndex + 1}`}
                            style={styles.input}
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const updated = value.filter((_, i) => i !== optIndex);
                              onChange(updated);
                            }}
                            style={styles.smallButton}
                          >
                            ❌
                          </button>
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() => onChange([...value, ''])}
                        style={styles.smallButton}
                      >
                        ➕ Add Option
                      </button>
                    </div>
                  )}
                />
              </div>
            )}

            <button type="button" onClick={() => remove(index)} style={styles.removeBtn}>
              Remove Question
            </button>
          </div>
        );
      })}

      <div>
        <button
          type="button"
          onClick={() => append({ questionText: '', type: 'TEXT', options: [''] })}
          style={styles.addBtn}
        >
          ➕ Add Question
        </button>
      </div>

      <button type="submit" style={styles.submitBtn}>Submit Assessment</button>
    </form>
  );
}

// Basic styling
const styles = {
  form: {
    maxWidth: '700px',
    margin: '0 auto',
    padding: '20px',
    fontFamily: 'Arial',
  },
  questionBox: {
    border: '1px solid #ccc',
    padding: '15px',
    marginBottom: '20px',
    borderRadius: '8px',
  },
  input: {
    width: '100%',
    padding: '8px',
    marginBottom: '10px',
  },
  select: {
    width: '100%',
    padding: '8px',
    marginBottom: '10px',
  },
  removeBtn: {
    backgroundColor: '#e74c3c',
    color: 'white',
    border: 'none',
    padding: '6px 10px',
    cursor: 'pointer',
    borderRadius: '4px',
  },
  addBtn: {
    backgroundColor: '#3498db',
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    cursor: 'pointer',
    borderRadius: '4px',
    marginBottom: '20px',
  },
  submitBtn: {
    backgroundColor: '#2ecc71',
    color: 'white',
    border: 'none',
    padding: '12px 20px',
    cursor: 'pointer',
    borderRadius: '4px',
  },
  options: {
    marginTop: '10px',
  },
  smallButton: {
    marginLeft: '10px',
    padding: '5px 10px',
    borderRadius: '4px',
    cursor: 'pointer',
  },
};
