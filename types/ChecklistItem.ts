interface ChecklistItem {
    _id: number;
    type: string;
    amount_of_milk_produced: string;
    farmer: {
      name: string;
      city: string;
    };
    from: {
      name: string;
    };
    to: {
      name: string;
    };
    number_of_cows_head: string;
    had_supervision: boolean;
    location: {
      latitude: number;
      longitude: number;
    };
    created_at: Date;
    updated_at: Date;
    __v: number;
  }