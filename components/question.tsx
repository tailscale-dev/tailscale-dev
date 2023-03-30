export const Question = ({ children }) => {
  return (
    <div className="mb-4 mt-8 flex rounded-md bg-gray-100 p-4 font-medium dark:bg-gray-800 ">
      <div className="blog-qa-question flex-initial">{children}</div>
    </div>
  );
};
