const formSchema = [
  {
    name: "name",
    label: "Full Name",
    type: "text",
    placeholder: "Enter your name",
  },

  {
    name: "email",
    label: "Email",
    type: "email",
    placeholder: "Enter your email",
  },

  {
    name: "password",
    label: "Password",
    type: "password",
    placeholder: "Enter password",
  },

  {
    name: "accountType",
    label: "Account Type",
    type: "select",
    options: ["student", "professional"],
  },

  {
    name: "about",
    label: "About You",
    type: "textarea",
    placeholder: "Tell us about yourself",
  },

  {
    name: "college",
    label: "College Name",
    type: "text",
    placeholder: "Enter college name",
    condition: {
      field: "accountType",
      value: "student",
    },
  },

  {
    name: "course",
    label: "Course",
    type: "text",
    placeholder: "Enter course",
    condition: {
      field: "accountType",
      value: "student",
    },
  },

  {
    name: "company",
    label: "Company Name",
    type: "text",
    placeholder: "Enter company name",
    condition: {
      field: "accountType",
      value: "professional",
    },
  },

  {
    name: "experience",
    label: "Experience",
    type: "number",
    placeholder: "Years of experience",
    condition: {
      field: "accountType",
      value: "professional",
    },
  },
]

export default formSchema