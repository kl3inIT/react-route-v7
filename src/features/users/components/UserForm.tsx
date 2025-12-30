import { useForm, Controller } from "react-hook-form";
import { InputText } from "primereact/inputtext";
import { InputSwitch } from "primereact/inputswitch";
import { Button } from "primereact/button";
import { classNames } from "primereact/utils";
import type { User, CreateUserDto } from "../types";

interface UserFormProps {
    user?: User | null;
    onSubmit: (data: CreateUserDto) => void;
    onCancel: () => void;
    loading?: boolean;
}

export function UserForm({ user, onSubmit, onCancel, loading = false }: UserFormProps) {
    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<CreateUserDto>({
        defaultValues: {
            username: user?.username ?? "",
            firstName: user?.firstName ?? "",
            lastName: user?.lastName ?? "",
            email: user?.email ?? "",
            active: user?.active ?? true,
        },
    });

    const getFormErrorMessage = (name: keyof CreateUserDto) => {
        return errors[name] && (
            <small className="p-error">{errors[name]?.message}</small>
        );
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-column gap-4">
            {/* Username */}
            <div className="field">
                <label htmlFor="username" className="font-medium mb-2 block">
                    Username <span className="text-red-500">*</span>
                </label>
                <Controller
                    name="username"
                    control={control}
                    rules={{ required: "Username là bắt buộc" }}
                    render={({ field, fieldState }) => (
                        <InputText
                            id="username"
                            {...field}
                            disabled={!!user} // Không cho sửa username khi edit
                            className={classNames("w-full", {
                                "p-invalid": fieldState.error,
                            })}
                        />
                    )}
                />
                {getFormErrorMessage("username")}
            </div>

            {/* First Name */}
            <div className="field">
                <label htmlFor="firstName" className="font-medium mb-2 block">
                    Họ <span className="text-red-500">*</span>
                </label>
                <Controller
                    name="firstName"
                    control={control}
                    rules={{ required: "Họ là bắt buộc" }}
                    render={({ field, fieldState }) => (
                        <InputText
                            id="firstName"
                            {...field}
                            className={classNames("w-full", {
                                "p-invalid": fieldState.error,
                            })}
                        />
                    )}
                />
                {getFormErrorMessage("firstName")}
            </div>

            {/* Last Name */}
            <div className="field">
                <label htmlFor="lastName" className="font-medium mb-2 block">
                    Tên <span className="text-red-500">*</span>
                </label>
                <Controller
                    name="lastName"
                    control={control}
                    rules={{ required: "Tên là bắt buộc" }}
                    render={({ field, fieldState }) => (
                        <InputText
                            id="lastName"
                            {...field}
                            className={classNames("w-full", {
                                "p-invalid": fieldState.error,
                            })}
                        />
                    )}
                />
                {getFormErrorMessage("lastName")}
            </div>

            {/* Email */}
            <div className="field">
                <label htmlFor="email" className="font-medium mb-2 block">
                    Email <span className="text-red-500">*</span>
                </label>
                <Controller
                    name="email"
                    control={control}
                    rules={{
                        required: "Email là bắt buộc",
                        pattern: {
                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                            message: "Email không hợp lệ",
                        },
                    }}
                    render={({ field, fieldState }) => (
                        <InputText
                            id="email"
                            {...field}
                            type="email"
                            className={classNames("w-full", {
                                "p-invalid": fieldState.error,
                            })}
                        />
                    )}
                />
                {getFormErrorMessage("email")}
            </div>

            {/* Active */}
            <div className="field">
                <label htmlFor="active" className="font-medium mb-2 block">
                    Kích hoạt
                </label>
                <Controller
                    name="active"
                    control={control}
                    render={({ field }) => (
                        <InputSwitch
                            id="active"
                            checked={field.value ?? false}
                            onChange={(e) => field.onChange(e.value)}
                        />
                    )}
                />
            </div>

            {/* Actions */}
            <div className="flex justify-content-end gap-2 pt-3 border-top-1 surface-border">
                <Button
                    type="button"
                    label="Hủy"
                    icon="pi pi-times"
                    outlined
                    onClick={onCancel}
                    disabled={loading}
                />
                <Button
                    type="submit"
                    label={user ? "Cập nhật" : "Tạo mới"}
                    icon={loading ? "pi pi-spin pi-spinner" : "pi pi-check"}
                    disabled={loading}
                />
            </div>
        </form>
    );
}



