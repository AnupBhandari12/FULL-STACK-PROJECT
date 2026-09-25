export function validateForm(formData) {
  const errors = {}

  if (!formData.name.trim()) {
    errors.name = "Full name is required"
  }

  if (!formData.email.trim()) {
    errors.email = "Email is required"
  } else if (
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)
  ) {
    errors.email = "Enter a valid email"
  }

  if (!formData.password) {
    errors.password = "Password is required"
  } else if (formData.password.length < 8) {
    errors.password = "Password must be at least 8 characters"
  }

  if (!formData.accountType) {
    errors.accountType = "Select an account type"
  }

  if (!formData.about.trim()) {
    errors.about = "About you is required"
  }

  if (formData.accountType === "student") {
    if (!formData.college.trim()) {
      errors.college = "College name is required"
    }

    if (!formData.course.trim()) {
      errors.course = "Course is required"
    }
  }

  if (formData.accountType === "professional") {
    if (!formData.company.trim()) {
      errors.company = "Company name is required"
    }

    if (!formData.experience) {
      errors.experience = "Experience is required"
    }
  }

  return errors
}