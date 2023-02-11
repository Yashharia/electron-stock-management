export const disabledStyles = {
    control: (baseStyles, state) => ({
      ...baseStyles,
      backgroundColor: state.isDisabled ? '#fda09b' : '#b2e9b2',
    }),
    singleValue: (base, state) => ({
      ...base,
      color: '#000',
      display: state.isDisabled ? 'none' : 'block',
    }),
    placeholder:(base, state) => ({
      ...base,
      color: '#000',
      display: state.isDisabled ? 'none' : 'block',
    }),
    indicatorSeparator:(base, state) => ({
      ...base,
      backgroundColor: '#000',
      display: state.isDisabled ? 'none' : 'block',
    }),
    dropdownIndicator:(base, state) => ({
      ...base,
      color: '#000',
      display: state.isDisabled ? 'none' : 'block',
    }),
  }