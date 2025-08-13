import React from 'react';
import { FlatList, Pressable, View } from 'react-native';
import EventCard from './EventCard';
import { EventOnEvent } from '../types/event';

interface EventListProps {
  events: EventOnEvent[];
  onPressEvent: (event: EventOnEvent) => void;
  disableScroll?: boolean;
}

const EventList: React.FC<EventListProps> = ({ events, onPressEvent, disableScroll }) => {
  if (disableScroll) {
    return (
      <View style={{ paddingBottom: 16 }}>
        {events.map((item) => (
          <Pressable key={item.id} onPress={() => onPressEvent(item)}>
            <EventCard
              start={item.start}
              name={item.name}
              location={item.location_name ?? ''}
            />
          </Pressable>
        ))}
      </View>
    );
  }
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
          />
        </Pressable>
      )}
      contentContainerStyle={{ paddingBottom: 16 }}
    />
  );
};

export default EventList;
