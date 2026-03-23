package com.jeongmin.backend.facade;

import org.springframework.stereotype.Component;

import java.util.List;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.locks.ReentrantLock;
import java.util.function.Supplier;

@Component
public class DecorCreateLockManager {

    private final ConcurrentHashMap<String, ReentrantLock> locks = new ConcurrentHashMap<>();

    public <T> T executeWithLock(List<String> lockKeys, Supplier<T> action) {
        List<String> sortedKeys = lockKeys.stream().sorted().toList();

        try {
            for (String key : sortedKeys) {
                lock(key);
            }
            return action.get();
        } finally {
            for (String key : sortedKeys) {
                unlock(key);
            }
        }
    }

    private void lock(String key) {
        locks.computeIfAbsent(key, k -> new ReentrantLock()).lock();
    }

    private void unlock(String key) {
        ReentrantLock lock = locks.get(key);
        if (lock != null) {
            lock.unlock();
        }
    }
}
