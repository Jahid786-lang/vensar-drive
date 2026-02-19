import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import FormHelperText from '@mui/material/FormHelperText'
import { useAppDispatch } from '@/store/hooks'
import { addService } from '@/store/servicesSlice'
import { iconOptions } from '@/data/servicesData'
import { addServiceSchema, type AddServiceFormValues } from '@/schemas/addServiceSchema'
import { AppButton } from '@/components/AppButton'

const defaultValues: AddServiceFormValues = {
  label: '',
  iconId: '',
}

export function AddServiceForm() {
  const dispatch = useAppDispatch()

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<AddServiceFormValues>({
    resolver: zodResolver(addServiceSchema),
    defaultValues,
  })

  function onSubmit(data: AddServiceFormValues) {
    dispatch(addService({ label: data.label, iconId: data.iconId }))
    reset(defaultValues)
  }

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        maxWidth: 400,
      }}
    >
      <Controller
        name="label"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            label="Service name"
            placeholder="e.g. Solar Rooftop"
            error={!!errors.label}
            helperText={errors.label?.message}
            fullWidth
            variant="filled"
            size="small"
            sx={{
              '& .MuiFilledInput-root': {
                borderRadius: 2,
                bgcolor: 'background.paper',
                border: '1px solid',
                borderColor: 'divider',
                '&:hover': { borderColor: 'primary.light' },
                '&.Mui-focused': { borderColor: 'primary.main' },
              },
            }}
          />
        )}
      />
      <Controller
        name="iconId"
        control={control}
        render={({ field }) => (
          <FormControl
            fullWidth
            size="small"
            error={!!errors.iconId}
            variant="filled"
            sx={{
              '& .MuiFilledInput-root': {
                borderRadius: 2,
                bgcolor: 'background.paper',
                border: '1px solid',
                borderColor: 'divider',
                '&:hover': { borderColor: 'primary.light' },
                '&.Mui-focused': { borderColor: 'primary.main' },
              },
            }}
          >
            <InputLabel id="add-service-icon-label">Icon</InputLabel>
            <Select
              {...field}
              labelId="add-service-icon-label"
              label="Icon"
              displayEmpty
              renderValue={(v) => {
                const opt = iconOptions.find((o) => o.value === v)
                return opt ? opt.label : 'Select icon'
              }}
            >
              <MenuItem value="" disabled>
                Select icon
              </MenuItem>
              {iconOptions.map((opt) => (
                <MenuItem key={opt.value} value={opt.value}>
                  {opt.label}
                </MenuItem>
              ))}
            </Select>
            {errors.iconId && (
              <FormHelperText>{errors.iconId.message}</FormHelperText>
            )}
          </FormControl>
        )}
      />
      <AppButton
        type="submit"
        variant="contained"
        color="primary"
        loading={isSubmitting}
        sx={{ alignSelf: 'flex-start' }}
      >
        Add Service
      </AppButton>
    </Box>
  )
}
