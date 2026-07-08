'use client';
import React, { useState } from 'react';
import { Users, Bell, Plus, CheckCircle, Phone } from 'lucide-react';
import { useEmergency } from '@/hooks/useEmergency';
import { toast } from 'sonner';
import Link from 'next/link';

const contacts = [
  {
    id: 'contact-001',
    name: 'Priya Sharma',
    relation: 'Wife',
    phone: '+91 98765 43210',
    notified: false,
    avatar: 'PS',
  },
  {
    id: 'contact-002',
    name: 'Ankit Sharma',
    relation: 'Brother',
    phone: '+91 87654 32109',
    notified: false,
    avatar: 'AS',
  },
  {
    id: 'contact-003',
    name: 'Meera Patel',
    relation: 'Friend',
    phone: '+91 76543 21098',
    notified: false,
    avatar: 'MP',
  },
];

export default function TrustedContactsPanel() {
  const [contactList, setContactList] = useState(contacts);
  const [notifyingId, setNotifyingId] = useState<string | null>(null);
  const { triggerAlert, isLoading: isTriggering } = useEmergency();

  const handleNotify = async (id: string) => {
    const contact = contactList.find((c) => c.id === id);
    if (!contact) return;
    
    setNotifyingId(id);
    const result = await triggerAlert({
      alertType: 'MANUAL_TRIGGER',
      contactsNotified: [contact.phone],
    });
    setNotifyingId(null);

    if (result) {
      setContactList((prev) =>
        prev.map((c) => (c.id === id ? { ...c, notified: true } : c))
      );
    }
  };

  const handleNotifyAll = async () => {
    setNotifyingId('all');
    const result = await triggerAlert({
      alertType: 'MANUAL_TRIGGER',
      contactsNotified: contactList.filter(c => !c.notified).map(c => c.phone),
    });
    setNotifyingId(null);

    if (result) {
      setContactList((prev) => prev.map((c) => ({ ...c, notified: true })));
    }
  };

  return (
    <div className="bg-white border border-gray-200 shadow-xs flex flex-col h-full rounded-2xl">
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <Users size={16} className="text-blue-600" />
          <h3 className="text-sm font-bold text-gray-900">Trusted Contacts</h3>
        </div>
        <Link
          href="/settings"
          className="p-1.5 rounded-lg hover:bg-muted transition-colors"
          title="Add trusted contact"
        >
          <Plus size={14} className="text-muted-foreground hover:text-primary transition-colors" />
        </Link>
        <button
          onClick={() => toast.info('Add trusted contact — connect to user profile settings')}
          className="p-1.5 rounded-lg hover:bg-gray-150 transition-colors"
          title="Add trusted contact"
        >
          <Plus size={14} className="text-gray-400 hover:text-blue-600 transition-colors" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-cyber divide-y divide-gray-100">
        {contactList.map((contact) => (
          <div key={contact.id} className="flex items-center gap-3 px-5 py-3.5 hover:bg-gray-50/40 transition-colors">
            <div className="w-9 h-9 rounded-full bg-blue-50 border border-blue-200 flex items-center justify-center flex-shrink-0">
              <span className="text-xs font-bold text-blue-600">{contact.avatar}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-gray-900 truncate">{contact.name}</p>
              <p className="text-[10px] text-gray-400 font-semibold">{contact.relation} · {contact.phone}</p>
            </div>
            {contact.notified ? (
              <div className="flex items-center gap-1 text-green-700 flex-shrink-0">
                <CheckCircle size={14} className="text-green-600" />
                <span className="text-[10px] font-bold">Notified</span>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 flex-shrink-0">
                <a
                  href={`tel:${contact.phone}`}
                  className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
                  title={`Call ${contact.name}`}
                >
                  <Phone size={13} className="text-gray-400 hover:text-green-600 transition-colors" />
                </a>
                <button
                  onClick={() => handleNotify(contact.id)}

                  disabled={notifyingId === contact.id || isTriggering}
                  className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[10px] font-bold transition-colors ${
                    notifyingId === contact.id
                      ? 'bg-warning/30 text-warning cursor-not-allowed'
                      : 'bg-warning/15 border border-warning/30 text-warning hover:bg-warning/25'
                  }`}
                >
                  <Bell size={11} />
                  {notifyingId === contact.id ? 'Alerting...' : 'Alert'}
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="border-t border-gray-100 px-5 py-3">
        <button
          onClick={handleNotifyAll}
          disabled={notifyingId === 'all' || contactList.every((c) => c.notified)}
          className={`w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all duration-150 active:scale-95 ${
            contactList.every((c) => c.notified)

              ? 'bg-success/15 text-success border border-success/30 cursor-default'
              : notifyingId === 'all'
              ? 'bg-warning/30 text-warning cursor-not-allowed' :'bg-warning/15 text-warning border border-warning/30 hover:bg-warning/25'

          }`}
        >
          {contactList.every((c) => c.notified) ? (
            <><CheckCircle size={15} /> All contacts notified</>
          ) : notifyingId === 'all' ? (
            <><span className="w-3 h-3 rounded-full border-2 border-warning border-t-transparent animate-spin" /> Notifying...</>
          ) : (
            <><Bell size={15} /> Notify All Contacts</>
          )}
        </button>
      </div>
    </div>
  );
}