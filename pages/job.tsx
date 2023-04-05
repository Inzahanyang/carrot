import { NextPage } from "next";
import { useState } from "react";
import { useForm } from "react-hook-form";

interface JobForm {
  q1: string;
  q2: string;
  salary: string;
  introduce: string;
  tell: string;
  email: string;
}

const Job: NextPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<JobForm>();
  const [submit, setSubmit] = useState(false);
  const onValid = (data: JobForm) => {
    setSubmit(true);
  };
  return (
    <div className="bg-teal-50 py-10">
      <div className="mx-auto max-w-md rounded-xl border-2 border-r-8 border-b-8 border-black bg-rose-100 p-8">
        <h2 className="mb-8 text-center text-xl font-bold">
          Job Application Form
        </h2>
        <form className="space-y-4" onSubmit={handleSubmit(onValid)}>
          <div>
            <p className="mb-1.5 text-sm font-semibold text-gray-800">
              What department do you want to work for?
              {errors.q1 ? (
                <span className="ml-2 text-xs font-bold text-red-500">
                  *required
                </span>
              ) : (
                ""
              )}
            </p>
            <div className="space-y-0.5 text-sm text-gray-700">
              <div className="space-x-2">
                <input
                  {...register("q1", { required: true })}
                  name="q1"
                  type="radio"
                  id="sales"
                  value="Sales"
                  className="form-radio text-black accent-black focus:border-transparent focus:shadow-none focus:outline-none focus:ring-transparent"
                />
                <label htmlFor="sales">Sales</label>
              </div>
              <div className="space-x-2">
                <input
                  {...register("q1", { required: true })}
                  name="q1"
                  type="radio"
                  id="marketing"
                  value="Marketing"
                  className="form-radio text-black accent-black focus:border-transparent focus:shadow-none focus:outline-none focus:ring-transparent"
                />
                <label htmlFor="marketing">Marketing</label>
              </div>
              <div className="space-x-2">
                <input
                  {...register("q1", { required: true })}
                  name="q1"
                  type="radio"
                  id="accounting"
                  value="Accounting"
                  className="form-radio text-black accent-black focus:border-transparent focus:shadow-none focus:outline-none focus:ring-transparent"
                />
                <label htmlFor="accounting">Accounting</label>
              </div>
              <div className="space-x-2">
                <input
                  {...register("q1", { required: true })}
                  name="q1"
                  type="radio"
                  id="customer-service"
                  value="Customer service"
                  className="form-radio text-black accent-black focus:border-transparent focus:shadow-none focus:outline-none focus:ring-transparent"
                />
                <label htmlFor="customer-service">Customer Service</label>
              </div>
            </div>
          </div>
          <div>
            <p className="mb-1.5 text-sm font-semibold text-gray-800">
              Why do you want to join this company?
              {errors.q2 ? (
                <span className="ml-2 text-xs font-bold text-red-500">
                  *required
                </span>
              ) : (
                ""
              )}
            </p>
            <div className="space-y-0.5 text-sm text-gray-700">
              <div className="space-x-2">
                <input
                  {...register("q2", { required: true })}
                  name="q2"
                  className="form-radio text-black accent-black focus:border-transparent focus:shadow-none focus:outline-none focus:ring-transparent"
                  type="radio"
                  id="q2-1"
                  value="I want money!"
                />
                <label htmlFor="q2-1">I want money!</label>
              </div>
              <div className="space-x-2">
                <input
                  {...register("q2", { required: true })}
                  name="q2"
                  className="form-radio text-black accent-black focus:border-transparent focus:shadow-none focus:outline-none focus:ring-transparent"
                  type="radio"
                  id="q2-2"
                  value="I love this company"
                />
                <label htmlFor="q2-2">I love this company</label>
              </div>
              <div className="space-x-2">
                <input
                  {...register("q2", { required: true })}
                  name="q2"
                  className="form-radio text-black accent-black focus:border-transparent focus:shadow-none focus:outline-none focus:ring-transparent"
                  type="radio"
                  id="q2-3"
                  value="I want to learn"
                />
                <label htmlFor="q2-4">I want to learn</label>
              </div>
              <div className="space-x-2">
                <input
                  {...register("q2", { required: true })}
                  name="q2"
                  className="form-radio text-black accent-black focus:border-transparent focus:shadow-none focus:outline-none focus:ring-transparent"
                  type="radio"
                  id="q2-4"
                  value="I don't know why"
                />
                <label htmlFor="q2-4">I don't know why</label>
              </div>
            </div>
          </div>
          <div className="flex flex-col">
            <label
              className="mb-1 text-sm font-semibold text-gray-800"
              htmlFor="salary"
            >
              Salary
            </label>
            <select
              className="rounded-md border-2 border-black py-0.5 text-sm focus:outline-none"
              id="salary"
              {...register("salary", { required: true })}
            >
              <option value="$50k">$50K</option>
              <option value="$100k">$100K</option>
              <option value="$150k">$150K</option>
              <option value="$200k">$200K</option>
            </select>
          </div>
          <div className="flex flex-col">
            <label
              className="mb-1 text-sm font-semibold text-gray-800 "
              htmlFor="introduce"
            >
              Introduce yourself
            </label>
            <textarea
              {...register("introduce", { required: true })}
              className={`resize-none rounded-md border-2 border-black py-0.5 text-sm focus:outline-none ${
                errors && "focus:border-red-500 focus:ring-1 focus:ring-red-500"
              }`}
              id="introduce"
              rows={1}
            ></textarea>
            {errors.introduce ? (
              <span className="mt-0.5 text-xs font-bold text-red-500">
                Please write down your introduction.
              </span>
            ) : (
              ""
            )}
          </div>
          <div className="flex flex-col">
            <label
              className="mb-1 text-sm font-semibold text-gray-800 "
              htmlFor="tell"
            >
              Tell us what your dreams are
            </label>
            <textarea
              {...register("tell", { required: true })}
              className={`resize-none rounded-md border-2 border-black py-0.5 text-sm focus:outline-none ${
                errors && "focus:border-red-500 focus:ring-1 focus:ring-red-500"
              }`}
              id="tell"
              rows={4}
            ></textarea>
            {errors.tell ? (
              <span className="mt-0.5 text-xs font-bold text-red-500">
                Please write down your dreams are.
              </span>
            ) : (
              ""
            )}
          </div>
          <div className="flex flex-col">
            <label
              className="mb-1 text-sm font-semibold text-gray-800 "
              htmlFor="email"
            >
              Email
            </label>
            <input
              {...register("email", { required: true })}
              className={`resize-none rounded-md border-2 border-black py-0.5 text-sm focus:outline-none ${
                errors && "focus:border-red-500 focus:ring-1 focus:ring-red-500"
              }`}
              id="email"
              type="email"
            />
            {errors.email ? (
              <span className="mt-0.5 text-xs font-bold text-red-500">
                Please write down your email
              </span>
            ) : (
              ""
            )}
          </div>
          <button
            type="submit"
            className="w-full rounded-md border-2 border-r-4 border-b-4 border-black bg-yellow-300 py-3 font-bold text-gray-800 hover:bg-yellow-200 active:scale-95"
          >
            {submit ? "Done" : "Give me this job"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Job;
