import { useState } from "react";
import formSchema from "./data/formSchema";
import { validateForm } from "./utils/validation";
import Review from "./components/Review";

function App() {
  const [success, setSuccess] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    accountType: "",
    about: "",
    college: "",
    course: "",
    company: "",
    experience: "",
  });

  const [errors, setErrors] = useState({});
  const [showReview, setShowReview] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // user ले फेरि type गरेपछि त्यो field को error हटाउने
    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const validationErrors = validateForm(formData);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});

    setShowReview(true);
  };

  const finalSubmit = () => {
    console.log("Final submitted data:", formData);

    setSuccess("Profile submitted successfully!");

    setFormData({
      name: "",
      email: "",
      password: "",
      accountType: "",
      about: "",
      college: "",
      course: "",
      company: "",
      experience: "",
    });

    setShowReview(false);
  };

  if (showReview) {
    return (
      <Review
        formData={formData}
        onEdit={() => setShowReview(false)}
        onSubmit={finalSubmit}
      />
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold">Developer Profile Form</h1>

      <form onSubmit={handleSubmit} className="mt-6">
        {formSchema.map((field) => {
          // Conditional field check
          if (
            field.condition &&
            formData[field.condition.field] !== field.condition.value
          ) {
            return null;
          }

          return (
            <div key={field.name} className="mb-4">
              <label className="block mb-1">{field.label}</label>

              {field.type === "select" ? (
                <select
                  name={field.name}
                  value={formData[field.name]}
                  onChange={handleChange}
                  className="border p-2 rounded"
                >
                  <option value="">Select</option>

                  {field.options?.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              ) : field.type === "textarea" ? (
                <textarea
                  name={field.name}
                  placeholder={field.placeholder}
                  value={formData[field.name]}
                  onChange={handleChange}
                  className="border p-2 rounded"
                />
              ) : (
                <input
                  type={field.type}
                  name={field.name}
                  placeholder={field.placeholder}
                  value={formData[field.name]}
                  onChange={handleChange}
                  className="border p-2 rounded"
                />
              )}

              {errors[field.name] && (
                <p className="mt-1 text-sm">{errors[field.name]}</p>
              )}
            </div>
          );
        })}

        <button type="submit" className="border p-2 rounded">
          Continue
        </button>
      </form>

      {success && <p className="mt-4">{success}</p>}

    </div>
  );
}

export default App;
