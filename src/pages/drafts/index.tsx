import React, { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Truck, Calendar, Edit3, Trash2, CheckCircle } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../store";
import { updateDraft, deleteDraft, Draft } from "../../store/drafts";
import { createLogFromDraft } from "../../store/logs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { addDays, format } from "date-fns";

const formSchema = z
  .object({
    providerId: z.string().min(1, "Provider ID is required"),
    serviceOrder: z.string().min(1, "Service Order is required"),
    truckIdOrTrailer: z.string().min(1, "Truck ID or Trailer is required"),
    odometer: z
      .number({ invalid_type_error: "Odometer must be a number" })
      .positive("Odometer must be positive"),
    engineHours: z
      .number({ invalid_type_error: "Engine Hours must be a number" })
      .positive("Engine Hours must be positive"),
    startDate: z.string().min(1, "Start Date is required"),
    endDate: z.string().min(1, "End Date is required"),
    type: z.enum(["planned", "unplanned", "emergency"]),
    serviceDescription: z.string().min(1, "Service Description is required"),
  })
  .refine((data) => data.endDate > data.startDate, {
    path: ["endDate"],
    message: "End Date must be later than Start Date",
  });

const DraftPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams<{ id: string }>();
  if (!id) return;
  const draft = useSelector((state: RootState) => state.drafts.drafts[id]);

  const [status, setStatus] = useState("Saved");
  const [saveTimeout, setSaveTimeout] = useState<NodeJS.Timeout | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isValid },
  } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
    defaultValues: draft,
  });

  const startDate = watch("startDate");

  useEffect(() => {
    if (startDate) {
      const nextDay = format(addDays(new Date(startDate), 1), "yyyy-MM-dd");
      setValue("endDate", nextDay);
    }
  }, [startDate, setValue]);

  const saveDraft = (updatedValues: Draft) => {
    if (!id) return;
    setStatus("Saving...");
    dispatch(updateDraft({ ...updatedValues, id }));
    setStatus("Saved");
  };

  const handleSave = (updatedValues: Draft) => {
    setStatus("Saving...");
    if (saveTimeout) clearTimeout(saveTimeout);
    setSaveTimeout(
      setTimeout(() => {
        saveDraft(updatedValues);
      }, 1000),
    );
  };

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    if (id) {
      dispatch(createLogFromDraft(values as Draft));
      dispatch(deleteDraft(id));
      navigate("/logs");
    }
  };

  if (!draft || !id) {
    return <DraftNotFound />;
  }

  return (
    <div key={id} className="w-screen h-full mx-auto py-8 px-4 rounded shadow">
      <form
        onSubmit={handleSubmit(onSubmit)}
        onChange={() => handleSave(watch() as Draft)}
        className="draft-form"
      >
        <SectionTitle
          index={"01"}
          icon={<Edit3 size={24} />}
          title="Provider"
        />
        <div className="flex space-x-4">
          <div className="w-full space-y-2">
            <label className="block text-sm font-medium">Provider ID</label>
            <Input {...register("providerId")} />
            {errors.providerId && (
              <p className="text-red-500 text-sm">
                {errors.providerId.message}
              </p>
            )}
          </div>
          <div className="w-full space-y-2">
            <label className="block text-sm font-medium">Service Order</label>
            <Input {...register("serviceOrder")} />
            {errors.serviceOrder && (
              <p className="text-red-500 text-sm">
                {errors.serviceOrder.message}
              </p>
            )}
          </div>
        </div>

        <SectionTitle
          index={"02"}
          icon={<Truck size={24} />}
          title="Transport"
        />
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium">
              Truck ID or Trailer
            </label>
            <Input {...register("truckIdOrTrailer")} />
            {errors.truckIdOrTrailer && (
              <p className="text-red-500 text-sm">
                {errors.truckIdOrTrailer.message}
              </p>
            )}
          </div>
          <div className="flex space-x-4">
            <div className="w-full space-y-2">
              <label className="block text-sm font-medium">Odometer (mi)</label>
              <Input {...register("odometer", { valueAsNumber: true })} />
              {errors.odometer && (
                <p className="text-red-500 text-sm">
                  {errors.odometer.message}
                </p>
              )}
            </div>
            <div className="w-full space-y-2">
              <label className="block text-sm font-medium">Engine Hours</label>
              <Input {...register("engineHours", { valueAsNumber: true })} />
              {errors.engineHours && (
                <p className="text-red-500 text-sm">
                  {errors.engineHours.message}
                </p>
              )}
            </div>
          </div>
        </div>

        <SectionTitle
          index={"03"}
          icon={<Calendar size={24} />}
          title="Service"
        />
        <div className="flex space-x-4">
          <div className="w-full space-y-2">
            <label className="block text-sm font-medium">Start Date</label>
            <Input type="date" {...register("startDate")} />
            {errors.startDate && (
              <p className="text-red-500 text-sm">{errors.startDate.message}</p>
            )}
          </div>
          <div className="w-full space-y-2">
            <label className="block text-sm font-medium">End Date</label>
            <Input type="date" {...register("endDate")} />
            {errors.endDate && (
              <p className="text-red-500 text-sm">{errors.endDate.message}</p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium">Type</label>
          <Select
            onValueChange={(value) => setValue("type", value as any)}
            defaultValue={watch("type")}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="planned">Planned</SelectItem>
              <SelectItem value="unplanned">Unplanned</SelectItem>
              <SelectItem value="emergency">Emergency</SelectItem>
            </SelectContent>
          </Select>
          {errors.type && (
            <p className="text-red-500 text-sm">{errors.type.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium">
            Service Description
          </label>
          <Textarea {...register("serviceDescription")} />
          {errors.serviceDescription && (
            <p className="text-red-500 text-sm">
              {errors.serviceDescription.message}
            </p>
          )}
        </div>

        <div className="flex justify-between items-center ">
          <Button variant="ghost" onClick={() => dispatch(deleteDraft(id))}>
            <Trash2 size={16} />
          </Button>
          <div className="flex gap-4">
            {status && (
              <div className=" text-sm text-foreground/40 flex items-center">
                {status === "Saved" && (
                  <CheckCircle className="mr-2 text-green-500" size={16} />
                )}
                {status}
              </div>
            )}
            <Button type="submit" disabled={!isValid}>
              Create Log
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

function SectionTitle({
  icon,
  title,
  index,
}: {
  icon: React.ReactNode;
  title: string;
  index: string;
}) {
  return (
    <h3>
      {icon}
      <span className="absolute -left-12 -top-full text-7xl text-foreground/5 ">
        {index}
      </span>
      <span>{title}</span>
    </h3>
  );
}

function DraftNotFound() {
  return (
    <div className="p-6 text-center">
      <h1 className="text-2xl font-bold">No draft selected</h1>
      <p className="mt-2">Choose from existing ones or create a new one.</p>
    </div>
  );
}

export default DraftPage;
