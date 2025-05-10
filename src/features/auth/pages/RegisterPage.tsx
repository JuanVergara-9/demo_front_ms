// src/features/auth/pages/RegisterPage.tsx
import React, { useState } from 'react';
import RegisterForm from '../components/RegisterForm';
import BecomeProviderForm from '../components/BecomeProviderForm';
import { Tab } from '@headlessui/react';

const RegisterPage: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState(0);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Únete a miservicio
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Crea tu cuenta y conecta con los mejores servicios profesionales
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <Tab.Group selectedIndex={selectedTab} onChange={setSelectedTab}>
            <Tab.List className="flex border-b border-gray-200">
              <Tab 
                className={({ selected }) => 
                  `w-1/2 py-4 text-sm font-medium text-center focus:outline-none ${
                    selected 
                      ? 'text-blue-600 border-b-2 border-blue-600' 
                      : 'text-gray-500 hover:text-gray-700'
                  }`
                }
              >
                Cliente
              </Tab>
              <Tab 
                className={({ selected }) => 
                  `w-1/2 py-4 text-sm font-medium text-center focus:outline-none ${
                    selected 
                      ? 'text-blue-600 border-b-2 border-blue-600' 
                      : 'text-gray-500 hover:text-gray-700'
                  }`
                }
              >
                Proveedor de servicios
              </Tab>
            </Tab.List>
            <Tab.Panels>
              <Tab.Panel>
                <div className="p-6">
                  <RegisterForm />
                </div>
              </Tab.Panel>
              <Tab.Panel>
                <div className="p-6">
                  <BecomeProviderForm isNewUser={true} />
                </div>
              </Tab.Panel>
            </Tab.Panels>
          </Tab.Group>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;