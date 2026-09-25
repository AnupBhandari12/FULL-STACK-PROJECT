function Review({ formData, onEdit, onSubmit }) {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">
        Review Your Information
      </h2>

      <p>
        <strong>Name:</strong> {formData.name}
      </p>

      <p>
        <strong>Email:</strong> {formData.email}
      </p>

      <p>
        <strong>Account Type:</strong> {formData.accountType}
      </p>

      <p>
        <strong>About:</strong> {formData.about}
      </p>

      {formData.accountType === "student" && (
        <>
          <p>
            <strong>College:</strong> {formData.college}
          </p>

          <p>
            <strong>Course:</strong> {formData.course}
          </p>
        </>
      )}

      {formData.accountType === "professional" && (
        <>
          <p>
            <strong>Company:</strong> {formData.company}
          </p>

          <p>
            <strong>Experience:</strong> {formData.experience} years
          </p>
        </>
      )}

      <div className="mt-6">
        <button
          onClick={onEdit}
          className="border p-2 rounded mr-2"
        >
          Edit
        </button>

        <button
          onClick={onSubmit}
          className="border p-2 rounded"
        >
          Submit
        </button>
      </div>
    </div>
  )
}

export default Review