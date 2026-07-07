'use client';
import React, { useState } from 'react';
import { Users, Bell, Plus, CheckCircle, Phone } from 'lucide-react';
import { toast } from 'sonner';

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
  const [notifyingAll, setNotifyingAll] = useState(false);

  const handleNotify = (id: string) => {
    setContactList((prev) =>
      prev.map((c) => c.id === id ? { ...c, notified: true } : c)
    );
    const contact = contactList.find((c) => c.id === id);
    toast.success(`Alert sent to ${contact?.name}`, {
      description: 'They have been notified of the cyber fraud incident',
    });
  };

  const handleNotifyAll = async () => {
    setNotifyingAll(true);
    await new Promise((r) => setTimeout(r, 1200));
    setContactList((prev) => prev.map((c) => ({ ...c, notified: true })));
    setNotifyingAll(false);
    toast.success('All trusted contacts notified', {
      description: `${contacts.length} people have been alerted about your situation`,
    });
  };

  return (
    <div className="glass-card rounded-2xl border border-border flex flex-col h-full">
      <div className="flex items-center justify-between px-5 py-4 border-b border-border">
        <div className="flex items-center gap-2">
          <Users size={16} className="text-primary" />
          <h3 className="text-sm font-bold text-foreground">Trusted Contacts</h3>
        </div>
        <button
          onClick={() => toast.info('Add trusted contact — connect to user profile settings')}
          className="p-1.5 rounded-lg hover:bg-muted transition-colors"
          title="Add trusted contact"
        >
          <Plus size={14} className="text-muted-foreground hover:text-primary transition-colors" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-cyber divide-y divide-border">
        {contactList.map((contact) => (
          <div key={contact.id} className="flex items-center gap-3 px-5 py-3.5 hover:bg-muted/30 transition-colors">
            <div className="w-9 h-9 rounded-full bg-primary/15 border border-primary/20 flex items-center justify-center flex-shrink-0">
              <span className="text-xs font-bold text-primary">{contact.avatar}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-foreground truncate">{contact.name}</p>
              <p className="text-[10px] text-muted-foreground">{contact.relation} · {contact.phone}</p>
            </div>
            {contact.notified ? (
              <div className="flex items-center gap-1 text-success flex-shrink-0">
                <CheckCircle size={14} />
                <span className="text-[10px] font-semibold">Notified</span>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 flex-shrink-0">
                <a
                  href={`tel:${contact.phone}`}
                  className="p-1.5 rounded-lg hover:bg-muted transition-colors"
                  title={`Call ${contact.name}`}
                >
                  <Phone size={13} className="text-muted-foreground hover:text-success transition-colors" />
                </a>
                <button
                  onClick={() => handleNotify(contact.id)}
                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-warning/15 border border-warning/30 text-[10px] font-bold text-warning hover:bg-warning/25 transition-colors"
                >
                  <Bell size={11} />
                  Alert
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="border-t border-border px-5 py-3">
        <button
          onClick={handleNotifyAll}
          disabled={notifyingAll || contactList.every((c) => c.notified)}
          className={`w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all duration-150 active:scale-95 ${
            contactList.every((c) => c.notified)
              ? 'bg-success/15 text-success border border-success/30 cursor-default'
              : notifyingAll
              ? 'bg-warning/30 text-warning cursor-not-allowed' :'bg-warning/15 text-warning border border-warning/30 hover:bg-warning/25'
          }`}
        >
          {contactList.every((c) => c.notified) ? (
            <><CheckCircle size={15} /> All contacts notified</>
          ) : notifyingAll ? (
            <><span className="w-3 h-3 rounded-full border-2 border-warning border-t-transparent animate-spin" /> Notifying...</>
          ) : (
            <><Bell size={15} /> Notify All Contacts</>
          )}
        </button>
      </div>
    </div>
  );
}