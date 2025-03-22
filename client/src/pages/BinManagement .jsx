import React from "react";
import { FaRecycle, FaTrash, FaUtensils, FaBox, FaLeaf } from "react-icons/fa";
import { FiMenu } from "react-icons/fi";
import Sidebar from "../components/Sidebar"; // Import the Sidebar component

const BinManagement = () => {
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  // Data for the grouped bar chart

  // Options for the bar chart
  const chartOptions = {
    responsive: true, // Make the chart responsive
    maintainAspectRatio: false, // Allow the chart to stretch to fit the container
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Monthly Inventory Overview (2023)",
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Months",
        },
        stacked: false, // Grouped bars (not stacked)
      },
      y: {
        title: {
          display: true,
          text: "Inventory (kg)",
        },
        beginAtZero: true,
        stacked: false, // Grouped bars (not stacked)
      },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex">
      {/* Sidebar */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        {/* Header with Menu Button */}
        <header className="flex justify-between items-center mb-8">
          <button
            className="md:hidden text-gray-800 text-2xl"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <FiMenu />
          </button>
          <h1 className="text-3xl font-bold text-gray-800">
            Bin & Tools Dashboard
          </h1>
        </header>

        {/* Top Boxes */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
          {/* Box 1: Plastic */}
          <div className="w-full h-35 bg-white rounded-lg shadow-lg flex items-center p-4 transform hover:scale-105 transition-transform border border-blue-200">
            {/* Icon aligned to the left */}
            <div className="flex-shrink-0">
              <FaTrash className="text-4xl text-blue-600 mb-2" />
            </div>

            {/* Content aligned to the right of the icon */}
            <div className="ml-4 flex-1">
              <h2 className="text-lg font-semibold text-gray-700 mt-0">
                Plastic
              </h2>
              <div className="flex gap-4 mt-2">
                {/* Available Count */}
                <div className="flex-1 text-center bg-blue-50 p-2 rounded-lg">
                  <p className="text-sm text-gray-500">Available</p>
                  <p className="text-xl font-bold text-blue-600">80</p>
                </div>

                {/* Dispatched Count */}
                <div className="flex-1 text-center bg-green-50 p-2 rounded-lg">
                  <p className="text-sm text-gray-500">Dispatched</p>
                  <p className="text-xl font-bold text-green-600">40</p>
                </div>
              </div>
            </div>
          </div>

          {/* Box 2: Paper */}
          <div className="w-full h-35 bg-white rounded-lg shadow-lg flex items-center p-4 transform hover:scale-105 transition-transform border border-blue-200">
            {/* Icon aligned to the left */}
            <div className="flex-shrink-0">
              <FaTrash className="text-4xl text-green-600 mb-2" />
            </div>

            {/* Content aligned to the right of the icon */}
            <div className="ml-4 flex-1">
              <h2 className="text-lg font-semibold text-gray-700 mt-0">
                Paper
              </h2>
              <div className="flex gap-4 mt-2">
                {/* Available Count */}
                <div className="flex-1 text-center bg-blue-50 p-2 rounded-lg">
                  <p className="text-sm text-gray-500">Available</p>
                  <p className="text-xl font-bold text-blue-600">80</p>
                </div>

                {/* Dispatched Count */}
                <div className="flex-1 text-center bg-green-50 p-2 rounded-lg">
                  <p className="text-sm text-gray-500">Dispatched</p>
                  <p className="text-xl font-bold text-green-600">40</p>
                </div>
              </div>
            </div>
          </div>

          {/* Box 3: Food */}
          <div className="w-full h-35 bg-white rounded-lg shadow-lg flex items-center p-4 transform hover:scale-105 transition-transform border border-blue-200">
            {/* Icon aligned to the left */}
            <div className="flex-shrink-0">
              <FaTrash className="text-4xl text-orange-600 mb-2" />
            </div>

            {/* Content aligned to the right of the icon */}
            <div className="ml-4 flex-1">
              <h2 className="text-lg font-semibold text-gray-700 mt-0">Food</h2>
              <div className="flex gap-4 mt-2">
                {/* Available Count */}
                <div className="flex-1 text-center bg-blue-50 p-2 rounded-lg">
                  <p className="text-sm text-gray-500">Available</p>
                  <p className="text-xl font-bold text-blue-600">80</p>
                </div>

                {/* Dispatched Count */}
                <div className="flex-1 text-center bg-green-50 p-2 rounded-lg">
                  <p className="text-sm text-gray-500">Dispatched</p>
                  <p className="text-xl font-bold text-green-600">40</p>
                </div>
              </div>
            </div>
          </div>

          {/* Box 4: General Waste */}
          <div className="w-full h-35 bg-white rounded-lg shadow-lg flex items-center p-4 transform hover:scale-105 transition-transform border border-blue-200">
            {/* Icon aligned to the left */}
            <div className="flex-shrink-0">
              <FaTrash className="text-4xl text-red-600 mb-2" />
            </div>

            {/* Content aligned to the right of the icon */}
            <div className="ml-4 flex-1">
              <h2 className="text-lg font-semibold text-gray-700 mt-0">
                General Waste
              </h2>
              <div className="flex gap-4 mt-2">
                {/* Available Count */}
                <div className="flex-1 text-center bg-blue-50 p-2 rounded-lg">
                  <p className="text-sm text-gray-500">Available</p>
                  <p className="text-xl font-bold text-blue-600">80</p>
                </div>

                {/* Dispatched Count */}
                <div className="flex-1 text-center bg-green-50 p-2 rounded-lg">
                  <p className="text-sm text-gray-500">Dispatched</p>
                  <p className="text-xl font-bold text-green-600">40</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Large Box for Chart or Data Visualization */}

        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Monthly Inventory Overview (2023)
        </h2>

        <div className="bg-white rounded-lg shadow-lg p-4">
          <table class="w-full min-w-max table-auto text-left">
            <thead>
              <tr>
                <th class="border-y border-blue-gray-100 bg-blue-gray-50/50 p-4">
                  <p class="block antialiased font-sans text-sm text-blue-gray-900 font-normal leading-none opacity-70">
                    Company
                  </p>
                </th>
                <th class="border-y border-blue-gray-100 bg-blue-gray-50/50 p-4">
                  <p class="block antialiased font-sans text-sm text-blue-gray-900 font-normal leading-none opacity-70">
                    Bin Type
                  </p>
                </th>
                <th class="border-y border-blue-gray-100 bg-blue-gray-50/50 p-4">
                  <p class="block antialiased font-sans text-sm text-blue-gray-900 font-normal leading-none opacity-70">
                    Date
                  </p>
                </th>
                <th class="border-y border-blue-gray-100 bg-blue-gray-50/50 p-4">
                  <p class="block antialiased font-sans text-sm text-blue-gray-900 font-normal leading-none opacity-70">
                    Status
                  </p>
                </th>
                <th class="border-y border-blue-gray-100 bg-blue-gray-50/50 p-4">
                  <p class="block antialiased font-sans text-sm text-blue-gray-900 font-normal leading-none opacity-70">
                    Units
                  </p>
                </th>
                <th class="border-y border-blue-gray-100 bg-blue-gray-50/50 p-4">
                  <p class="block antialiased font-sans text-sm text-blue-gray-900 font-normal leading-none opacity-70"></p>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td class="p-4 border-b border-blue-gray-50">
                  <div class="flex items-center gap-3">
                    <img
                      src="https://docs.material-tailwind.com/img/logos/logo-spotify.svg"
                      alt="Spotify"
                      class="inline-block relative object-center !rounded-full w-12 h-12 rounded-lg border border-blue-gray-50 bg-blue-gray-50/50 object-contain p-1"
                    />
                    <p class="block antialiased font-sans text-sm leading-normal text-blue-gray-900 font-bold">
                      Spotify
                    </p>
                  </div>
                </td>
                <td class="p-4 border-b border-blue-gray-50">
                  <p class="block antialiased font-sans text-sm leading-normal text-blue-gray-900 font-normal">
                  Plastic
                  </p>
                </td>
                <td class="p-4 border-b border-blue-gray-50">
                  <p class="block antialiased font-sans text-sm leading-normal text-blue-gray-900 font-normal">
                    Wed 3:00pm
                  </p>
                </td>
                <td class="p-4 border-b border-blue-gray-50">
                  <div class="w-max">
                    <div class="relative grid items-center font-sans font-bold uppercase whitespace-nowrap select-none bg-green-500/20 text-green-900 py-1 px-2 text-xs rounded-md">
                      <span class="">paidacvadcasc</span>
                    </div>
                  </div>
                </td>
                <td class="p-4 border-b border-blue-gray-50">
                  <div class="flex items-center gap-3">5</div>
                </td>
                <td class="p-4 border-b border-blue-gray-50">
                  <button
                    class="relative align-middle select-none font-sans font-medium text-center uppercase transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none w-10 max-w-[40px] h-10 max-h-[40px] rounded-lg text-xs text-gray-900 hover:bg-gray-900/10 active:bg-gray-900/20"
                    type="button"
                  >
                    <span class="absolute top-1/2 left-1/2 transform -translate-y-1/2 -translate-x-1/2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        aria-hidden="true"
                        class="h-4 w-4"
                      >
                        <path d="M21.731 2.269a2.625 2.625 0 00-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 000-3.712zM19.513 8.199l-3.712-3.712-12.15 12.15a5.25 5.25 0 00-1.32 2.214l-.8 2.685a.75.75 0 00.933.933l2.685-.8a5.25 5.25 0 002.214-1.32L19.513 8.2z"></path>
                      </svg>
                    </span>
                  </button>
                </td>
              </tr>
              <tr>
                <td class="p-4 border-b border-blue-gray-50">
                  <div class="flex items-center gap-3">
                    <img
                      src="https://docs.material-tailwind.com/img/logos/logo-pinterest.svg"
                      alt="Pinterest"
                      class="inline-block relative object-center !rounded-full w-12 h-12 rounded-lg border border-blue-gray-50 bg-blue-gray-50/50 object-contain p-1"
                    />
                    <p class="block antialiased font-sans text-sm leading-normal text-blue-gray-900 font-bold">
                      Pinterest
                    </p>
                  </div>
                </td>
                <td class="p-4 border-b border-blue-gray-50">
                  <p class="block antialiased font-sans text-sm leading-normal text-blue-gray-900 font-normal">
                  Paper
                  </p>
                </td>
                <td class="p-4 border-b border-blue-gray-50">
                  <p class="block antialiased font-sans text-sm leading-normal text-blue-gray-900 font-normal">
                    Mon 7:40pm
                  </p>
                </td>
                <td class="p-4 border-b border-blue-gray-50">
                  <div class="w-max">
                    <div class="relative grid items-center font-sans font-bold uppercase whitespace-nowrap select-none bg-amber-500/20 text-amber-900 py-1 px-2 text-xs rounded-md">
                      <span class="">pending</span>
                    </div>
                  </div>
                </td>
                <td class="p-4 border-b border-blue-gray-50">
                  <div class="flex items-center gap-3">5</div>
                </td>
                <td class="p-4 border-b border-blue-gray-50">
                  <button
                    class="relative align-middle select-none font-sans font-medium text-center uppercase transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none w-10 max-w-[40px] h-10 max-h-[40px] rounded-lg text-xs text-gray-900 hover:bg-gray-900/10 active:bg-gray-900/20"
                    type="button"
                  >
                    <span class="absolute top-1/2 left-1/2 transform -translate-y-1/2 -translate-x-1/2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        aria-hidden="true"
                        class="h-4 w-4"
                      >
                        <path d="M21.731 2.269a2.625 2.625 0 00-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 000-3.712zM19.513 8.199l-3.712-3.712-12.15 12.15a5.25 5.25 0 00-1.32 2.214l-.8 2.685a.75.75 0 00.933.933l2.685-.8a5.25 5.25 0 002.214-1.32L19.513 8.2z"></path>
                      </svg>
                    </span>
                  </button>
                </td>
              </tr>
              <tr>
                <td class="p-4 border-b border-blue-gray-50">
                  <div class="flex items-center gap-3">
                    <img
                      src="https://docs.material-tailwind.com/img/logos/logo-google.svg"
                      alt="Google"
                      class="inline-block relative object-center !rounded-full w-12 h-12 rounded-lg border border-blue-gray-50 bg-blue-gray-50/50 object-contain p-1"
                    />
                    <p class="block antialiased font-sans text-sm leading-normal text-blue-gray-900 font-bold">
                      Google
                    </p>
                  </div>
                </td>
                <td class="p-4 border-b border-blue-gray-50">
                  <p class="block antialiased font-sans text-sm leading-normal text-blue-gray-900 font-normal">
                  Food

                  </p>
                </td>
                <td class="p-4 border-b border-blue-gray-50">
                  <p class="block antialiased font-sans text-sm leading-normal text-blue-gray-900 font-normal">
                    Wed 5:00pm
                  </p>
                </td>
                <td class="p-4 border-b border-blue-gray-50">
                  <div class="w-max">
                    <div class="relative grid items-center font-sans font-bold uppercase whitespace-nowrap select-none bg-green-500/20 text-green-900 py-1 px-2 text-xs rounded-md">
                      <span class="">paid</span>
                    </div>
                  </div>
                </td>
                <td class="p-4 border-b border-blue-gray-50">
                  <div class="flex items-center gap-3">5</div>
                </td>
                <td class="p-4 border-b border-blue-gray-50">
                  <button
                    class="relative align-middle select-none font-sans font-medium text-center uppercase transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none w-10 max-w-[40px] h-10 max-h-[40px] rounded-lg text-xs text-gray-900 hover:bg-gray-900/10 active:bg-gray-900/20"
                    type="button"
                  >
                    <span class="absolute top-1/2 left-1/2 transform -translate-y-1/2 -translate-x-1/2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        aria-hidden="true"
                        class="h-4 w-4"
                      >
                        <path d="M21.731 2.269a2.625 2.625 0 00-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 000-3.712zM19.513 8.199l-3.712-3.712-12.15 12.15a5.25 5.25 0 00-1.32 2.214l-.8 2.685a.75.75 0 00.933.933l2.685-.8a5.25 5.25 0 002.214-1.32L19.513 8.2z"></path>
                      </svg>
                    </span>
                  </button>
                </td>
              </tr>
              <tr>
                <td class="p-4">
                  <div class="flex items-center gap-3">
                    <img
                      src="https://docs.material-tailwind.com/img/logos/logo-netflix.svg"
                      alt="netflix"
                      class="inline-block relative object-center !rounded-full w-12 h-12 rounded-lg border border-blue-gray-50 bg-blue-gray-50/50 object-contain p-1"
                    />
                    <p class="block antialiased font-sans text-sm leading-normal text-blue-gray-900 font-bold">
                      netflix
                    </p>
                  </div>
                </td>
                <td class="p-4">
                  <p class="block antialiased font-sans text-sm leading-normal text-blue-gray-900 font-normal">
                  General Wasten
                  </p>
                </td>
                <td class="p-4">
                  <p class="block antialiased font-sans text-sm leading-normal text-blue-gray-900 font-normal">
                    Wed 3:30am
                  </p>
                </td>
                <td class="p-4">
                  <div class="w-max">
                    <div class="relative grid items-center font-sans font-bold uppercase whitespace-nowrap select-none bg-red-500/20 text-red-900 py-1 px-2 text-xs rounded-md">
                      <span class="">cancelled</span>
                    </div>
                  </div>
                </td>
                <td class="p-4">
                  <div class="flex items-center gap-3">5</div>
                </td>
                <td class="p-4">
                  <button
                    class="relative align-middle select-none font-sans font-medium text-center uppercase transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none w-10 max-w-[40px] h-10 max-h-[40px] rounded-lg text-xs text-gray-900 hover:bg-gray-900/10 active:bg-gray-900/20"
                    type="button"
                  >
                    <span class="absolute top-1/2 left-1/2 transform -translate-y-1/2 -translate-x-1/2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        aria-hidden="true"
                        class="h-4 w-4"
                      >
                        <path d="M21.731 2.269a2.625 2.625 0 00-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 000-3.712zM19.513 8.199l-3.712-3.712-12.15 12.15a5.25 5.25 0 00-1.32 2.214l-.8 2.685a.75.75 0 00.933.933l2.685-.8a5.25 5.25 0 002.214-1.32L19.513 8.2z"></path>
                      </svg>
                    </span>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};

export default BinManagement;
