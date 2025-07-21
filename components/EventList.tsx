import React from 'react';
import { FlatList, Pressable } from 'react-native';
import EventCard from './EventCard';
import { EventOnEvent } from '../types/event';

interface EventListProps {
  events: EventOnEvent[];
  onPressEvent: (event: EventOnEvent) => void;
}

const EventList: React.FC<EventListProps> = ({ events, onPressEvent }) => {
  return (
    <FlatList
      data={events}
      keyExtractor={item => item.id.toString()}
      renderItem={({ item }) => (
        <Pressable onPress={() => onPressEvent(item)}>
          <EventCard
            start={item.start}
            name={item.name}
            location={item.location_name ?? ''}
            // image={item.image_url}
          />
        </Pressable>
      )}
      contentContainerStyle={{ paddingBottom: 16 }}
    />
  );
};

export default EventList;
