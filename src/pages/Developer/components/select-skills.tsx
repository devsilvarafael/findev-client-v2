// MultiSelectWithExperience.tsx
import { Controller, useFormContext, useWatch } from "react-hook-form";
import Select from "react-select";

export const TechnologyMultiSelect = ({ field, control, name }) => {
  const value = useWatch({
    control,
    name,
  });

  const experienceOptions = Array.from({ length: 21 }, (_, i) => ({
    value: i,
    label: i === 0 ? "0 (Menos de 1 ano)" : i === 1 ? "1 ano" : `${i} anos`,
  }));

  return (
    <div className="w-full">
      <Controller
        name={name}
        control={control}
        rules={{ 
          required: field.required,
          validate: (value) => 
            !field.required || 
            (Array.isArray(value) && value.length > 0)
        }}
        render={({ field: { onChange, value: currentValue } }) => (
          <>
            <Select
              isMulti
              options={field.items}
              value={currentValue}
              onChange={(selectedOptions) => {
                const optionsWithExperience = selectedOptions.map(option => ({
                  ...option,
                  experienceYears: 0
                }));
                onChange(optionsWithExperience);
              }}
              placeholder={field.placeholder}
              className="react-select-container"
              classNamePrefix="react-select"
              closeMenuOnSelect={false}
            />
            
            {currentValue?.length > 0 && (
              <div className="mt-4 space-y-3">
                <h4 className="text-sm font-medium text-gray-700">
                  {field.experienceField?.label || "Experiência"}
                </h4>
                {currentValue.map((skill, index) => (
                  <div key={skill.id || skill.value} className="flex flex-col sm:flex-row sm:items-center gap-3 mb-3">
                    <span className="w-full sm:w-1/2 text-sm">{skill.label}</span>
                    <div className="w-full sm:w-1/2 flex gap-2">
                      <Select
                        options={experienceOptions}
                        value={experienceOptions.find(opt => opt.value === (skill.experienceYears || 0))}
                        onChange={(selectedOption) => {
                          const newValue = [...currentValue];
                          newValue[index].experienceYears = selectedOption?.value;
                          onChange(newValue);
                        }}
                        className="flex-1 react-select-container"
                        classNamePrefix="react-select"
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      />
    </div>
  );
};