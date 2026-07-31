"use client";

import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { Truck, Save, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface ShippingMethod {
  id: string;
  name: string;
  description: string;
  basePrice: number;
  perKmPrice: number;
  estimatedDays: string;
  enabled: boolean;
}

interface ShippingSettings {
  methods: ShippingMethod[];
  freeShippingOver: number;
  enableTracking: boolean;
}

export default function ShippingSettingsPage() {
  const [settings, setSettings] = useState<ShippingSettings>({
    methods: [],
    freeShippingOver: 500000,
    enableTracking: true,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const docRef = doc(db, "systemSettings", "shipping");
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setSettings(docSnap.data() as ShippingSettings);
      } else {
        // Initialize with default methods
        setSettings({
          methods: [
            {
              id: "1",
              name: "Regular Shipping",
              description: "Standard delivery",
              basePrice: 50000,
              perKmPrice: 2000,
              estimatedDays: "3-5 days",
              enabled: true,
            },
            {
              id: "2",
              name: "Express Shipping",
              description: "Fast delivery",
              basePrice: 100000,
              perKmPrice: 3000,
              estimatedDays: "1-2 days",
              enabled: true,
            },
          ],
          freeShippingOver: 500000,
          enableTracking: true,
        });
      }
    } catch (error) {
      console.error("Error loading settings:", error);
      toast.error("Gagal memuat pengaturan");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const docRef = doc(db, "systemSettings", "shipping");
      await setDoc(docRef, settings, { merge: true });
      toast.success("Pengaturan pengiriman berhasil disimpan");
    } catch (error) {
      console.error("Error saving settings:", error);
      toast.error("Gagal menyimpan pengaturan");
    } finally {
      setSaving(false);
    }
  };

  const addShippingMethod = () => {
    const newMethod: ShippingMethod = {
      id: Date.now().toString(),
      name: "New Shipping Method",
      description: "",
      basePrice: 0,
      perKmPrice: 0,
      estimatedDays: "3-5 days",
      enabled: true,
    };
    setSettings({
      ...settings,
      methods: [...settings.methods, newMethod],
    });
  };

  const updateMethod = (id: string, updates: Partial<ShippingMethod>) => {
    setSettings({
      ...settings,
      methods: settings.methods.map((m) =>
        m.id === id ? { ...m, ...updates } : m,
      ),
    });
  };

  const deleteMethod = (id: string) => {
    setSettings({
      ...settings,
      methods: settings.methods.filter((m) => m.id !== id),
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Truck size={32} className="text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-900 font-poppins">
            Shipping & Delivery
          </h1>
        </div>
        <p className="text-gray-600 font-poppins">
          Configure shipping methods and delivery settings
        </p>
      </div>

      {/* Settings Form */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-8">
        {/* General Settings */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4 font-poppins">
            General Settings
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 font-poppins">
                Free Shipping Over (IDR)
              </label>
              <input
                type="number"
                value={settings.freeShippingOver}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    freeShippingOver: parseInt(e.target.value),
                  })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-poppins text-gray-900 bg-white"
              />
            </div>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.enableTracking}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    enableTracking: e.target.checked,
                  })
                }
                className="w-4 h-4"
              />
              <span className="text-sm font-medium text-gray-700 font-poppins">
                Enable Order Tracking
              </span>
            </label>
          </div>
        </div>

        {/* Shipping Methods */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 font-poppins">
              Shipping Methods
            </h2>
            <button
              onClick={addShippingMethod}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors font-poppins"
            >
              <Plus size={18} />
              Add Method
            </button>
          </div>

          <div className="space-y-4">
            {settings.methods.map((method) => (
              <div
                key={method.id}
                className="p-4 border border-gray-200 rounded-lg space-y-3"
              >
                <div className="flex items-end gap-2">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1 font-poppins">
                      Method Name
                    </label>
                    <input
                      type="text"
                      value={method.name}
                      onChange={(e) =>
                        updateMethod(method.id, { name: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-poppins text-gray-900 bg-white"
                    />
                  </div>
                  <button
                    onClick={() => deleteMethod(method.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 font-poppins">
                    Description
                  </label>
                  <input
                    type="text"
                    value={method.description}
                    onChange={(e) =>
                      updateMethod(method.id, { description: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-poppins text-gray-900 bg-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 font-poppins">
                      Base Price (IDR)
                    </label>
                    <input
                      type="number"
                      value={method.basePrice}
                      onChange={(e) =>
                        updateMethod(method.id, {
                          basePrice: parseInt(e.target.value),
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-poppins"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 font-poppins">
                      Per KM (IDR)
                    </label>
                    <input
                      type="number"
                      value={method.perKmPrice}
                      onChange={(e) =>
                        updateMethod(method.id, {
                          perKmPrice: parseInt(e.target.value),
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-poppins"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 font-poppins">
                    Estimated Days
                  </label>
                  <input
                    type="text"
                    value={method.estimatedDays}
                    onChange={(e) =>
                      updateMethod(method.id, { estimatedDays: e.target.value })
                    }
                    placeholder="e.g., 3-5 days"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-poppins text-gray-900 bg-white placeholder-gray-500"
                  />
                </div>

                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={method.enabled}
                    onChange={(e) =>
                      updateMethod(method.id, { enabled: e.target.checked })
                    }
                    className="w-4 h-4"
                  />
                  <span className="text-sm font-medium text-gray-700 font-poppins">
                    Enable this method
                  </span>
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Save Button */}
        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 transition-colors font-poppins"
        >
          <Save size={18} />
          {saving ? "Saving..." : "Save Shipping Settings"}
        </button>
      </div>
    </div>
  );
}
